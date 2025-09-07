package com.screening.profile.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.screening.profile.dto.CandidateProcessingDTO;
import com.screening.profile.dto.CandidateReqDTO;
import com.screening.profile.exception.ServiceException;
import com.screening.profile.model.Candidate;
import com.screening.profile.model.Job;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.job.JobService;
import com.screening.profile.util.enums.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static com.screening.profile.util.ExtractorHelperUtils.createUniqueId;
import static com.screening.profile.util.ExtractorHelperUtils.formatPhoneNumber;
import static com.screening.profile.util.parser.PdfParsingUtil.extractText;

@Slf4j
@Service
public class PerplexityService {

    @Value("${perplexity.api.key:}")
    private String apiKey;

    @Value("${perplexity.base-url:https://api.perplexity.ai/chat/completions}")
    private String API_ENDPOINT;

    @Value("${perplexity.enabled:true}")
    private boolean enabled;

    private final CandidateService candidateService;
    private final JobService jobService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PerplexityService(CandidateService candidateService, JobService jobService) {
        this.candidateService = candidateService;
        this.jobService = jobService;
    }

    public Candidate askPerplexityForPrompt(MultipartFile resumeFile, Long jobId, CandidateReqDTO candidateReqDTO) throws Exception {
        String resume = extractText(resumeFile);

        // If disabled or no API key provided, fallback locally
        if (!enabled || apiKey == null || apiKey.isBlank()) {
            String fallback = makeFallbackJson(resume, jobService.getJobDescription(jobId));
            return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "sonar-pro");
        payload.put("max_tokens", 500);
        payload.put("temperature", 0.7);

        String jobDescriptionWithSkills = "";
        Optional<Job> job = jobService.getJob(Math.toIntExact(jobId));
        if(job.isPresent()){
            jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getDescription();
            jobDescriptionWithSkills = jobDescriptionWithSkills + " Requrired Skills : ";
            jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getRequiredSkills();
        }
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "You are an AI job screening assistant. Compare the following resume and job description, and output a JSON with fields matchedSkills (list), missingSkills (list), score (double 0-100 with 2 digit precision in percentage), and summary (one line). In the summary also include the years of work experience matching with the job description and the work experience mentioned in resume which will not be explicitly mentioned"
        ));
        messages.add(Map.of(
                "role", "user",
                "content", String.format("Resume: %s\nJob Description: %s", resume, jobDescriptionWithSkills)
        ));
        payload.put("messages", messages);

        String requestBody = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_ENDPOINT))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                // Graceful fallback on 4xx/5xx
                String fallback = makeFallbackJson(resume, jobDescriptionWithSkills);
                return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
            }

            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode choices = rootNode.get("choices");
            if (choices != null && choices.isArray() && !choices.isEmpty()) {
                JsonNode firstChoice = choices.get(0);
                JsonNode message = firstChoice.get("message");
                if (message != null) {
                    JsonNode contentNode = message.get("content");
                    if (contentNode != null) {
                        Candidate candidate = candidateService.extractAndSaveCandidateDetails(resumeFile, contentNode.asText(), jobId, candidateReqDTO);
                        if (Optional.ofNullable(candidate).isEmpty()){
                            return null;
                        }
                        return candidate;
                    }
                }
            }
            throw new ServiceException(String.valueOf(response.statusCode()),"Invalid response structure from Perplexity API");
        } catch (Exception ex) {
            // Network/auth errors -> fallback
            String fallback = makeFallbackJson(resume, jobDescriptionWithSkills);
            return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
        }
    }

    public CandidateProcessingDTO askPerplexityAndGetParallelResponse(List<MultipartFile> resumeFile, Long jobId){

        int poolSize = Math.min(resumeFile.size(), 20);
        ExecutorService executor = Executors.newFixedThreadPool(poolSize);
        List<String> duplicateList = Collections.synchronizedList(new ArrayList<>());
        try {
            List<CompletableFuture<Candidate>> futures = resumeFile.stream()
                    .map(resumes -> CompletableFuture.supplyAsync(() -> {

                        int activeThreadsInside = Thread.activeCount();
                        log.info("Active threads inside : {}", activeThreadsInside);
                        try {

                            String resume = extractText(resumes);
                            if (candidateService.isDuplicate(resume)) {
                                log.info("Duplicate candidate!");
                                duplicateList.add(resumes.getOriginalFilename());
                                return null;
                            }
                            Map<String, Object> payload = new HashMap<>();
                            payload.put("model", "sonar-pro");
                            payload.put("max_tokens", 500);
                            payload.put("temperature", 0.7);

                            String jobDescriptionWithSkills = "";
                            Optional<Job> job = jobService.getJob(Math.toIntExact(jobId));
                            if (job.isPresent()) {
                                jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getDescription();
                                jobDescriptionWithSkills = jobDescriptionWithSkills + " Requrired Skills : ";
                                jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getRequiredSkills();
                            }
                            List<Map<String, String>> messages = new ArrayList<>();
                            messages.add(Map.of(
                                    "role", "system",
                                    "content", "You are an AI job screening assistant. Compare the following resume with the job description provided, and output a JSON with fields matchedSkills (list), missingSkills (list), score (double 0-100 with 2 digit precision in percentage),name, email, phoneNumber and summary (one line). In the summary also include the years of work experience that matches with the job description."
                            ));
                            messages.add(Map.of(
                                    "role", "user",
                                    "content", String.format("Resume: %s\nJob Description: %s", resume, jobDescriptionWithSkills)
                            ));
                            payload.put("messages", messages);

                            String requestBody = objectMapper.writeValueAsString(payload);
                            HttpRequest request = HttpRequest.newBuilder()
                                    .uri(URI.create(API_ENDPOINT))
                                    .header("Authorization", "Bearer " + apiKey)
                                    .header("Content-Type", "application/json")
                                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                                    .build();
                            HttpResponse<String> response = HttpClient.newHttpClient()
                                    .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                                    .join();

                            JsonNode rootNode = objectMapper.readTree(response.body());
                            JsonNode choices = rootNode.get("choices");
                            if (choices != null && choices.isArray() && !choices.isEmpty()) {
                                JsonNode firstChoice = choices.get(0);
                                JsonNode message = firstChoice.get("message");
                                if (message != null) {
                                    JsonNode contentNode = message.get("content");
                                    if (contentNode != null) {
                                        String text = contentNode.asText();
                                        JsonNode node = objectMapper.readTree(text);
                                        String summary = objectMapper.readTree(text).get("summary").asText();
                                        Double score = objectMapper.readTree(text).get("score").asDouble();
                                        List<String> matchedSkills = objectMapper.readerForListOf(String.class).readValue(objectMapper.readTree(text).get("matchedSkills"));

                                        String name = node.get("name").asText();
                                        String email = node.get("email").asText();
                                        String phoneNumber = node.get("phoneNumber").asText();
                                        log.info("Name : {}, Email : {}, Phone Number : {}", name, email, phoneNumber);

                                        String uniqueId = createUniqueId(name, email, phoneNumber);
                                        Candidate candidateBatch = new Candidate();
                                        candidateBatch.setName(name);
                                        candidateBatch.setPhoneNumber(formatPhoneNumber(phoneNumber));
                                        candidateBatch.setEmail(email);
                                        candidateBatch.setStatus(Status.IN_PROCESS);
                                        candidateBatch.setDateOfBirth(null);
                                        candidateBatch.setFileData(resumes.getBytes());
                                        candidateBatch.setMatchedSkills(matchedSkills);
                                        candidateBatch.setScore(score);
                                        candidateBatch.setSummary(summary);
                                        candidateBatch.setResumeText(resume);
                                        candidateBatch.setUniqueId(uniqueId);
                                        candidateService.saveCandidate(candidateBatch);
                                        candidateService.saveJobApplicationAndInterview(jobId,candidateBatch);
                                        return candidateBatch;
                                    }
                                }
                            }
                            return null;
                        } catch (Exception e) {

                            duplicateList.add(resumes.getOriginalFilename());
                            log.error("Got an error.....!!!!! : {}", e.getMessage());
                            return null;
                        }
                    }, executor))
                    .toList();

            List<Candidate> candidateList = futures.stream()
                    .map(CompletableFuture::join)
                    .filter(Objects::nonNull)
                    .toList();

            log.info("CandidateList size : {}", candidateList.size());
            CandidateProcessingDTO candidateProcessingDTO = new CandidateProcessingDTO();
            candidateProcessingDTO.setProcessedCandidates(candidateList);
            candidateProcessingDTO.setUnProcessedCandidates(duplicateList);
            return candidateProcessingDTO;
        } finally {
            executor.shutdown();
        }
    }


    public String askPerplexityForSummarizedFeedback(String feedback) throws IOException, InterruptedException {

        String summaryFeedback = "";
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "sonar-pro");
        payload.put("max_tokens", 500);
        payload.put("temperature", 0.7);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "Summarize the given paragraph in about 200 words if possible, it is a feedback for a candidate which has been interviewed, this summary will be read by the talent acquisition team. Return the response in a simple string format."
        ));
        messages.add(Map.of(
                "role", "user",
                "content", feedback
        ));
        payload.put("messages", messages);

        String requestBody = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_ENDPOINT))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode choices = rootNode.get("choices");
            if (choices != null && choices.isArray() && !choices.isEmpty()) {
                JsonNode firstChoice = choices.get(0);
                JsonNode message = firstChoice.get("message");
                if (message != null) {
                    JsonNode contentNode = message.get("content");
                    if (contentNode != null) {
                        summaryFeedback = contentNode.asText();
                    }
                }
            }
        } catch (Exception e){
            throw new ServiceException(e.getMessage(), e.getLocalizedMessage());
        }
        return summaryFeedback;
    }

    private String makeFallbackJson(String resume, String jobDescription) {
        // Very basic heuristic; you can enhance later
        int score = Math.min(10, Math.max(0, (resume.length() + jobDescription.length()) / 2000));
        String summary = "Local evaluation used due to unavailable AI service. Score is heuristic.";
        return String.format(Locale.ROOT, "{\"summary\":\"%s\",\"score\":%d,\"matchedSkills\":[\"Basic Skills\"],\"missingSkills\":[\"Advanced Skills\"]}", summary, score);
    }
}

