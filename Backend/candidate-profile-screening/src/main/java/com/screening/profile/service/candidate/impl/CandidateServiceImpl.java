package com.screening.profile.service.candidate.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.screening.profile.dto.CandidateInterviewDTO;
import com.screening.profile.dto.CandidateReqDTO;
import com.screening.profile.exception.ServiceException;
import com.screening.profile.exception.DuplicateCandidateException;
import com.screening.profile.model.Candidate;
import com.screening.profile.model.JobApplication;
import com.screening.profile.model.Interview;
import com.screening.profile.repository.CandidateRepository;
import com.screening.profile.repository.JobApplicationRepository;
import com.screening.profile.repository.InterviewRepository;
import com.screening.profile.service.job.JobService;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.util.enums.Status;
import lombok.extern.slf4j.Slf4j;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.screening.profile.util.parser.PdfParsingUtil.extractText;

@Service
@Slf4j
public class CandidateServiceImpl implements CandidateService {

    private static final int SIMILARITY_THRESHOLD = 90;

    private final CandidateRepository candidateRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final InterviewRepository interviewRepository;
    private final JobService jobService;

    public CandidateServiceImpl(CandidateRepository candidateRepository, JobApplicationRepository jobApplicationRepository, InterviewRepository interviewRepository, JobService jobService) {
        this.candidateRepository = candidateRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.interviewRepository = interviewRepository;
        this.jobService = jobService;
    }

    @Override
    public Candidate extractAndSaveCandidateDetails(MultipartFile resume, String text, Long jobId, CandidateReqDTO candidateReqDTO) throws IOException {
        Candidate candidate = new Candidate();
        String resumeText = extractText(resume);
        candidateReqDTO.setResumeText(resumeText);
        ObjectMapper objectMapper = new ObjectMapper();
        String email = candidateReqDTO.getEmail();
        String name = candidateReqDTO.getName();
        String phone = candidateReqDTO.getPhoneNumber();
        String uniqueId = createUniqueId(name, email, phone);
        List<JobApplication> apppliedJobList = jobApplicationRepository.findByJobId(jobId);
        JobApplication jobApplication = apppliedJobList.stream()
                .filter(jobApp -> jobApp.getCandidate().getUniqueId()
                .equals(uniqueId)).findFirst()
                .orElse(null);

        // Duplicacy logic needs to be checked
        if(jobApplication != null){
            Long id = jobApplication.getCandidate().getId();
            if(candidateRepository.findById(id).isPresent()) {
                log.info("Candidate already exists");
                return null;
            }
        }

        //Duplicacy check on content similarity with different email and phoneNumber
        List<JobApplication> allJobApplications = jobApplicationRepository.findByJobId(jobId);

        boolean isDuplicate = allJobApplications.stream()
                .map(JobApplication::getCandidate)
                .filter(candidateForThisApplication -> candidateForThisApplication.getName().equals(candidateReqDTO.getName())
                        && candidateForThisApplication.getDateOfBirth().equals(candidateReqDTO.getDob()))
                .anyMatch(candidateForThisApplication -> {
                    int similarityScore = FuzzySearch.ratio(
                            candidateReqDTO.getResumeText(),
                            candidateForThisApplication.getResumeText()
                    );
                    log.info("Similarity score : {}", similarityScore);
                    return similarityScore >= SIMILARITY_THRESHOLD;
                });

        if (isDuplicate) {
            log.info("You have already applied for this job role with different email/phone number");
            throw new DuplicateCandidateException("You have already applied for this job role with different email/phone number");
        }

        String summary = objectMapper.readTree(text).get("summary").asText();
        Integer score = objectMapper.readTree(text).get("score").asInt();
        List<String> matchedSkills = objectMapper.readerForListOf(String.class).readValue(objectMapper.readTree(text).get("matchedSkills"));
        candidate.setEmail(email);
        candidate.setPhoneNumber(phone);
        candidate.setDateOfBirth(candidateReqDTO.getDob());
        candidate.setName(candidateReqDTO.getName());
        candidate.setScore(score);
        candidate.setSummary(summary);
        candidate.setFileData(resume.getBytes());
        candidate.setUniqueId(uniqueId);
        candidate.setMatchedSkills(matchedSkills);
        candidate.setStatus(Status.IN_PROCESS);
        candidate.setResumeText(resumeText);
        log.info(candidate.toString());
        candidateRepository.save(candidate);
        JobApplication newJobApplication = new JobApplication();
        newJobApplication.setCandidate(candidate);
        newJobApplication.setJob(jobService.getJob(Math.toIntExact(jobId)).get());
        newJobApplication.setApplicationDate(LocalDateTime.now());
        jobApplicationRepository.save(newJobApplication);
        Interview interview = new Interview();
        interview.setJobApplication(newJobApplication);
        interviewRepository.save(interview);
        
        return candidate;
    }

    public List<Candidate> getAllCandidates(){
        return candidateRepository.findAll();
    }

    public boolean saveCandidate(Candidate candidate){
        Candidate savedCandidate = candidateRepository.save(candidate);
        return savedCandidate != null ? true : false;
    }

    @Override
    public List<Candidate> getAllCandidatesByJobId(Long id) {
        return jobApplicationRepository.findCandidatesByJobId(id);
    }

    @Override
    public boolean updateCandidateStatus(Long id, Status status) {
        Optional<Candidate> savedCandidate = candidateRepository.findById(id);
        if(savedCandidate.isPresent()){
            Candidate newCandidate = savedCandidate.get();
            newCandidate.setStatus(status);
            candidateRepository.save(newCandidate);
            return true;
        }
        return false;
    }

    @Override
    public List<CandidateInterviewDTO> getCandidatesWithInterviewFeedbackByJobId(Long joId) throws JsonProcessingException {
        List<Object[]> results = candidateRepository.findCandidatesWithInterviewFeedbackByJobId(Math.toIntExact(joId));
        List<CandidateInterviewDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {

            List<String> matchedSkills = null;
            if (row[4] != null) {
                try (ByteArrayInputStream bais = new ByteArrayInputStream((byte[])row[4]);
                     ObjectInputStream ois = new ObjectInputStream(bais)) {

                    @SuppressWarnings("unchecked")
                    List<String> skills = (List<String>) ois.readObject();
                    matchedSkills = skills;
                } catch (IOException | ClassNotFoundException e) {
                    throw new ServiceException(e.getMessage(),e.getLocalizedMessage());
                }
            }

            CandidateInterviewDTO dto = new CandidateInterviewDTO(
                    ((Number) row[0]).longValue(),   // id
                    (String) row[1],                 // date_of_birth
                    (String) row[2],                 // email
                    (byte[]) row[3],                 // file_data (keep as bytes or convert as needed)
                    matchedSkills,                   // parsed List<String>
                    (String) row[5],                 // name
                    (String) row[6],                 // phone_number
                    null,
                    row[8] != null ? ((Number)row[8]).intValue() : null,  // score
                    (String) row[9],                 // status
                    (String) row[10],                 // summary
                    (String) row[11],                // unique_id
                    (String) row[12],                // feedback_summary
                    (String) row[14],                 // round1Feedback
                    (String) row[15],                // round2Feedback
                    (String) row[16],                // round3Feedback
                    row[13] != null ? ((Number)row[13]).intValue() : null             // interviewId
            );
            dtoList.add(dto);
        }
        return dtoList;
    }

    public Candidate getCandidateById(Long id) {
        Optional<Candidate> candidate = candidateRepository.findById(id);
        return candidate.orElse(null);
    }
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
