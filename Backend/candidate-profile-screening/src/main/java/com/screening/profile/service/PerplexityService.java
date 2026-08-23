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

    public Candidate askGeminiForPrompt(MultipartFile resumeFile, Long jobId, CandidateReqDTO candidateReqDTO) throws Exception {
        String resume = extractText(resumeFile);

        // If disabled or no API key provided, fallback locally
        if (!enabled || apiKey == null || apiKey.isBlank()) {
            String fallback = makeFallbackJson(resume, jobService.getJobDescription(jobId));
            return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
        }

        String jobDescriptionWithSkills = "";
        Optional<Job> job = jobService.getJob(Math.toIntExact(jobId));
        if (job.isPresent()) {
            jobDescriptionWithSkills = job.get().getDescription() + " Required Skills : " + job.get().getRequiredSkills();
        }

        // 1. Combine all instructions and data into a single 'input' string
        String systemInstruction = "You are an AI job screening assistant. Compare the following resume and job description, and output a JSON with fields matchedSkills (list), missingSkills (list), score (double 0-100 with 2 digit precision in percentage), and summary (one line). In the summary also include the years of work experience matching with the job description and the work experience mentioned in resume which will not be explicitly mentioned.";
        String combinedInput = systemInstruction + "\n\nResume:\n" + resume + "\n\nJob Description:\n" + jobDescriptionWithSkills;

        // 2. Build the exact payload schema from the curl command
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gemini-3.5-flash-lite");
        payload.put("input", combinedInput);

        String requestBody = objectMapper.writeValueAsString(payload);

        // Using the specific interactions endpoint from your curl command
        String API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_ENDPOINT))
                .header("x-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        // 3. Setup HttpClient with a timeout to handle your network configuration
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(java.time.Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = null;
        int maxRetries = 3;
        boolean success = false;

        try {
            // 4. Retry loop to slip past the failing IP addresses (fixes the ConnectException)
            for (int i = 0; i < maxRetries; i++) {
                try {
                    response = client.send(request, HttpResponse.BodyHandlers.ofString());
                    success = true;
                    break;
                } catch (java.net.ConnectException | java.net.http.HttpTimeoutException e) {
                    if (i == maxRetries - 1) {
                        throw e;
                    }
                    Thread.sleep(1000); // Wait 1 second before trying the next IP
                }
            }

            if (!success || response.statusCode() != 200) {
                String fallback = makeFallbackJson(resume, jobDescriptionWithSkills);
                return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
            }

            // 5. Parse the interactions endpoint response
            JsonNode rootNode = objectMapper.readTree(response.body());
            String generatedJson = null;

            JsonNode steps = rootNode.path("steps");
            if (steps.isArray()) {
                for (JsonNode step : steps) {
                    // We want the step containing the actual answer, not the "thought" steps
                    if ("model_output".equals(step.path("type").asText())) {
                        JsonNode contents = step.path("content");
                        if (contents.isArray()) {
                            for (JsonNode content : contents) {
                                if ("text".equals(content.path("type").asText())) {
                                    generatedJson = content.path("text").asText();
                                    break; // Found the text, break out of content loop
                                }
                            }
                        }
                        break; // Found the output step, break out of steps loop
                    }
                }
            }

            if (generatedJson != null) {
                // 6. Clean up Markdown formatting
                // The model is returning the text wrapped in ```json ... ``` blocks.
                // We must cleanly strip them so extractAndSaveCandidateDetails gets pure JSON.
                generatedJson = generatedJson.trim();

                if (generatedJson.startsWith("```json")) {
                    generatedJson = generatedJson.substring(7);
                } else if (generatedJson.startsWith("```")) {
                    generatedJson = generatedJson.substring(3);
                }

                if (generatedJson.endsWith("```")) {
                    generatedJson = generatedJson.substring(0, generatedJson.length() - 3);
                }

                generatedJson = generatedJson.trim();

                // Pass the pure JSON string to your service
                Candidate candidate = candidateService.extractAndSaveCandidateDetails(resumeFile, generatedJson, jobId, candidateReqDTO);
                if (Optional.ofNullable(candidate).isEmpty()){
                    return null;
                }
                return candidate;
            }

            throw new ServiceException(String.valueOf(response.statusCode()), "Could not find model_output text in response: " + response.body());
        } catch (Exception ex) {
            // Network/auth errors -> fallback
            String fallback = makeFallbackJson(resume, jobDescriptionWithSkills);
            return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
        }
    }

//    public Candidate askPerplexityForPrompt(MultipartFile resumeFile, Long jobId, CandidateReqDTO candidateReqDTO) throws Exception {
//        String resume = extractText(resumeFile);
//
//        // If disabled or no API key provided, fallback locally
//        if (!enabled || apiKey == null || apiKey.isBlank()) {
//            String fallback = makeFallbackJson(resume, jobService.getJobDescription(jobId));
//            return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
//        }
//
//        Map<String, Object> payload = new HashMap<>();
//        payload.put("model", "sonar-pro");
//        payload.put("max_tokens", 500);
//        payload.put("temperature", 0.7);
//
//        String jobDescriptionWithSkills = "";
//        Optional<Job> job = jobService.getJob(Math.toIntExact(jobId));
//        if(job.isPresent()){
//            jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getDescription();
//            jobDescriptionWithSkills = jobDescriptionWithSkills + " Requrired Skills : ";
//            jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getRequiredSkills();
//        }
//        List<Map<String, String>> messages = new ArrayList<>();
//        messages.add(Map.of(
//                "role", "system",
//                "content", "You are an AI job screening assistant. Compare the following resume and job description, and output a JSON with fields matchedSkills (list), missingSkills (list), score (double 0-100 with 2 digit precision in percentage), and summary (one line). In the summary also include the years of work experience matching with the job description and the work experience mentioned in resume which will not be explicitly mentioned"
//        ));
//        messages.add(Map.of(
//                "role", "user",
//                "content", String.format("Resume: %s\nJob Description: %s", resume, jobDescriptionWithSkills)
//        ));
//        payload.put("messages", messages);
//
//        String requestBody = objectMapper.writeValueAsString(payload);
//
//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create(API_ENDPOINT))
//                .header("Authorization", "Bearer " + apiKey)
//                .header("Content-Type", "application/json")
//                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
//                .build();
//
//        try {
//            HttpResponse<String> response = HttpClient.newHttpClient()
//                    .send(request, HttpResponse.BodyHandlers.ofString());
//
//            if (response.statusCode() != 200) {
//                // Graceful fallback on 4xx/5xx
//                String fallback = makeFallbackJson(resume, jobDescriptionWithSkills);
//                return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
//            }
//
//            JsonNode rootNode = objectMapper.readTree(response.body());
//            JsonNode choices = rootNode.get("choices");
//            if (choices != null && choices.isArray() && !choices.isEmpty()) {
//                JsonNode firstChoice = choices.get(0);
//                JsonNode message = firstChoice.get("message");
//                if (message != null) {
//                    JsonNode contentNode = message.get("content");
//                    if (contentNode != null) {
//                        Candidate candidate = candidateService.extractAndSaveCandidateDetails(resumeFile, contentNode.asText(), jobId, candidateReqDTO);
//                        if (Optional.ofNullable(candidate).isEmpty()){
//                            return null;
//                        }
//                        return candidate;
//                    }
//                }
//            }
//            throw new ServiceException(String.valueOf(response.statusCode()),"Invalid response structure from Perplexity API");
//        } catch (Exception ex) {
//            // Network/auth errors -> fallback
//            String fallback = makeFallbackJson(resume, jobDescriptionWithSkills);
//            return candidateService.extractAndSaveCandidateDetails(resumeFile, fallback, jobId, candidateReqDTO);
//        }
//    }

    public CandidateProcessingDTO askGeminiAndGetParallelResponse(List<MultipartFile> resumeFile, Long jobId) {

        int poolSize = Math.min(resumeFile.size(), 20);
        ExecutorService executor = Executors.newFixedThreadPool(poolSize);
        List<String> duplicateList = Collections.synchronizedList(new ArrayList<>());

        // Build a single, thread-safe HttpClient to share across all futures
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(java.time.Duration.ofSeconds(10))
                .build();

        final String API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
        final String systemInstruction = "You are an AI job screening assistant. Compare the following resume with the job description provided, and output a JSON with fields matchedSkills (list), missingSkills (list), score (double 0-100 with 2 digit precision in percentage),name, email, phoneNumber and summary (one line). You must output ONLY a valid JSON object. Do not include explanations, Markdown, or code fences. In the summary also include the years of work experience that matches with the job description.";

        try {
            List<CompletableFuture<Candidate>> futures = resumeFile.stream()
                    .map(resumes -> CompletableFuture.supplyAsync(() -> {

                        int activeThreadsInside = Thread.activeCount();
                        log.info("Active threads inside : {}", activeThreadsInside);
                        try {
                            String resume = extractText(resumes);
                            if (candidateService.isDuplicate(resume, jobId)) {
                                log.info("Duplicate candidate!");
                                duplicateList.add(resumes.getOriginalFilename());
                                return null;
                            }

                            // Restored: Fetching job description inside the loop
                            String jobDescriptionWithSkills = "";
                            Optional<Job> job = jobService.getJob(Math.toIntExact(jobId));
                            if (job.isPresent()) {
                                jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getDescription();
                                jobDescriptionWithSkills = jobDescriptionWithSkills + " Requrired Skills : ";
                                jobDescriptionWithSkills = jobDescriptionWithSkills + job.get().getRequiredSkills();
                            }

                            // 1. Build Payload
                            String combinedInput = systemInstruction + "\n\nResume:\n" + resume + "\n\nJob Description:\n" + jobDescriptionWithSkills;
                            Map<String, Object> payload = new HashMap<>();
                            payload.put("model", "gemini-3.5-flash-lite");
                            payload.put("input", combinedInput);

                            String requestBody = objectMapper.writeValueAsString(payload);

                            HttpRequest request = HttpRequest.newBuilder()
                                    .uri(URI.create(API_ENDPOINT))
                                    .header("x-goog-api-key", apiKey)
                                    .header("Content-Type", "application/json")
                                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                                    .build();

                            // 2. Execute with Retry Loop
                            HttpResponse<String> response = null;
                            int maxRetries = 3;
                            boolean success = false;

                            for (int i = 0; i < maxRetries; i++) {
                                try {
                                    response = client.send(request, HttpResponse.BodyHandlers.ofString());
                                    success = true;
                                    break;
                                } catch (java.net.ConnectException | java.net.http.HttpTimeoutException e) {
                                    if (i == maxRetries - 1) throw e;
                                    Thread.sleep(1000);
                                }
                            }

                            if (!success || response.statusCode() != 200) {
                                log.error("API call failed with status code: {}", response != null ? response.statusCode() : "timeout");
                                duplicateList.add(resumes.getOriginalFilename());
                                return null;
                            }

                            // 3. Parse Gemini Response Structure
                            JsonNode rootNode = objectMapper.readTree(response.body());
                            String generatedJson = null;

                            JsonNode steps = rootNode.path("steps");
                            if (steps.isArray()) {
                                for (JsonNode step : steps) {
                                    if ("model_output".equals(step.path("type").asText())) {
                                        JsonNode contents = step.path("content");
                                        if (contents.isArray()) {
                                            for (JsonNode content : contents) {
                                                if ("text".equals(content.path("type").asText())) {
                                                    generatedJson = content.path("text").asText();
                                                    break;
                                                }
                                            }
                                        }
                                        break;
                                    }
                                }
                            }

                            if (generatedJson != null) {
                                // 4. Strip Markdown Formatting
                                generatedJson = generatedJson.trim();
                                if (generatedJson.startsWith("```json")) {
                                    generatedJson = generatedJson.substring(7);
                                } else if (generatedJson.startsWith("```")) {
                                    generatedJson = generatedJson.substring(3);
                                }
                                if (generatedJson.endsWith("```")) {
                                    generatedJson = generatedJson.substring(0, generatedJson.length() - 3);
                                }
                                generatedJson = generatedJson.trim();

                                // 5. Parse the extracted AI JSON and map to Entity
                                JsonNode node = objectMapper.readTree(generatedJson);

                                String summary = node.path("summary").asText("");
                                Double score = node.path("score").asDouble(0.0);
                                List<String> matchedSkills = objectMapper.readerForListOf(String.class).readValue(node.path("matchedSkills"));

                                String name = node.path("name").asText("");
                                String email = node.path("email").asText("");
                                String phoneNumber = node.path("phoneNumber").asText("");

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
                                candidateService.saveJobApplicationAndInterview(jobId, candidateBatch);

                                return candidateBatch;
                            }

                            log.error("Could not find model_output in response for file: {}", resumes.getOriginalFilename());
                            duplicateList.add(resumes.getOriginalFilename());
                            return null;

                        } catch (Exception e) {
                            log.error("Got an error.....!!!!! : {}", e.getMessage());
                            duplicateList.add(resumes.getOriginalFilename());
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
    public String askGeminiForSummarizedFeedback(String feedback) throws IOException, InterruptedException {

        String summaryFeedback = "";

        // 1. Combine instructions and data into a single 'input' string
        String systemInstruction = "Summarize the given paragraph in about 200 words if possible, it is a feedback for a candidate which has been interviewed, this summary will be read by the talent acquisition team. Return the response in a simple string format.";
        String combinedInput = systemInstruction + "\n\nCandidate Feedback:\n" + feedback;

        // 2. Build the exact payload schema
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gemini-3.5-flash-lite");
        payload.put("input", combinedInput);

        String requestBody = objectMapper.writeValueAsString(payload);

        String API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_ENDPOINT))
                .header("x-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();

        // 3. Setup HttpClient with a timeout
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(java.time.Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = null;
        int maxRetries = 3;
        boolean success = false;

        try {
            // 4. Retry loop to handle the flaky network connection
            for (int i = 0; i < maxRetries; i++) {
                try {
                    response = client.send(request, HttpResponse.BodyHandlers.ofString());
                    success = true;
                    break;
                } catch (java.net.ConnectException | java.net.http.HttpTimeoutException e) {
                    if (i == maxRetries - 1) {
                        throw e;
                    }
                    Thread.sleep(1000);
                }
            }

            if (!success || response.statusCode() != 200) {
                throw new ServiceException(
                        String.valueOf(response != null ? response.statusCode() : 500),
                        "API call failed or timed out."
                );
            }

            // 5. Parse the interactions endpoint response
            JsonNode rootNode = objectMapper.readTree(response.body());

            JsonNode steps = rootNode.path("steps");
            if (steps.isArray()) {
                for (JsonNode step : steps) {
                    if ("model_output".equals(step.path("type").asText())) {
                        JsonNode contents = step.path("content");
                        if (contents.isArray()) {
                            for (JsonNode content : contents) {
                                if ("text".equals(content.path("type").asText())) {
                                    // Extract and clean up the text
                                    summaryFeedback = content.path("text").asText().trim();
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }

            if (summaryFeedback.isBlank()) {
                throw new ServiceException("500", "Could not find model_output text in response structure.");
            }

        } catch (Exception e) {
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

