package com.screening.profile.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.screening.profile.exception.ServiceException;
import com.screening.profile.model.Candidate;
import com.screening.profile.repository.JobRepository;
import com.screening.profile.service.candidate.CandidateService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.screening.profile.util.parser.PdfParsingUtil.extractText;

@Service
public class PerplexityService {

    @Value("${perplexity.api.key}")
    private String apiKey;

    @Value("${perplexity.base-url}")
    private String API_ENDPOINT;

    private final CandidateService candidateService;
    private final JobService jobService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PerplexityService(CandidateService candidateService, JobService jobService) {
        this.candidateService = candidateService;
        this.jobService = jobService;
    }

    public Candidate askPerplexityForPrompt(MultipartFile resumeFile, Integer jobId) throws Exception {
        String resume = extractText(resumeFile);
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "sonar-pro");
        payload.put("max_tokens", 500);
        payload.put("temperature", 0.7);

        String jobDescription = jobService.getJobDescription(jobId);
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content", "You are an AI job screening assistant. Compare the following resume and job description, and output a JSON with fields matchedSkills (list), missingSkills (list), score (int 0-10), and summary (one line)."
        ));
        messages.add(Map.of(
                "role", "user",
                "content", String.format("Resume: %s\nJob Description: %s", resume, jobDescription)
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
                .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new ServiceException(String.valueOf(response.statusCode()) ,"Failed to get response from Perplexity API: " + response.body());
        }

        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode choices = rootNode.get("choices");
        if (choices != null && choices.isArray() && !choices.isEmpty()) {
            JsonNode firstChoice = choices.get(0);
            JsonNode message = firstChoice.get("message");
            if (message != null) {
                JsonNode contentNode = message.get("content");
                if (contentNode != null) {
                    Candidate candidate = candidateService.extractAndSaveCandidateDetails(resumeFile, contentNode.asText());
                    if(Optional.ofNullable(candidate).isEmpty()){
                        return null;
                    }
                    return candidate;
                }
            }
        }
        throw new ServiceException(String.valueOf(response.statusCode()),"Invalid response structure from Perplexity API");
    }

}

