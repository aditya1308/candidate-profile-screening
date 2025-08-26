package com.screening.profile.service.candidate.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.screening.profile.model.Candidate;
import com.screening.profile.repository.CandidateRepository;
import com.screening.profile.service.candidate.CandidateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

import static com.screening.profile.util.ExtractorHelperUtils.*;
import static com.screening.profile.util.ExtractorHelperUtils.extractName;
import static com.screening.profile.util.parser.PdfParsingUtil.extractText;

@Service
@Slf4j
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateServiceImpl(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Override
    public Candidate extractAndSaveCandidateDetails(MultipartFile resume, String text) throws IOException {
        String resumeText = extractText(resume);
        Candidate candidate = new Candidate();
        ObjectMapper objectMapper = new ObjectMapper();
        String email = extractEmail(resumeText);
        String name = extractName(resumeText, candidate);
        String phone = extractPhone(resumeText);
        String uniqueId = createUniqueId(name, email, phone);
        if(!candidateRepository.findByUniqueId(uniqueId).isEmpty()){
            log.info("Candidate already exists");
            return null;
        }
        String summary = objectMapper.readTree(text).get("summary").asText();
        Integer score = objectMapper.readTree(text).get("score").asInt();
        List<String> matchedSkills = objectMapper.readerForListOf(String.class).readValue(objectMapper.readTree(text).get("matchedSkills"));
        candidate.setEmail(email);
        candidate.setPhoneNumber(phone);
        candidate.setDateOfBirth(extractDob(resumeText));
        candidate.setName(name);
        candidate.setScore(score);
        candidate.setSummary(summary);
        candidate.setFileData(resume.getBytes());
        candidate.setUniqueId(uniqueId);
        candidate.setMatchedSkills(matchedSkills);
        log.info(candidate.toString());
        candidateRepository.save(candidate);
        return candidate;
    }

    @Override
    public Candidate getOrCreateCandidate(String name, String email, String phone) {
        String uniqueId = createUniqueId(name, email, phone);
        Optional<Candidate> existingCandidate = candidateRepository.findByUniqueId(uniqueId);
        
        if (existingCandidate.isPresent()) {
            return existingCandidate.get();
        }
        
        // Create new candidate if not exists
        Candidate candidate = new Candidate();
        candidate.setName(name);
        candidate.setEmail(email);
        candidate.setPhoneNumber(phone);
        candidate.setUniqueId(uniqueId);
        candidate.setScore(0); // Default score
        candidate.setSummary(""); // Default summary
        
        return candidateRepository.save(candidate);
    }

    @Override
    public Optional<Candidate> findByUniqueId(String uniqueId) {
        return candidateRepository.findByUniqueId(uniqueId).stream().findFirst();
    }

    public String createUniqueId(String name, String email, String phone)
    {
        try {
            String combined = name + email + phone;
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(combined.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.substring(0, 10);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }
}
