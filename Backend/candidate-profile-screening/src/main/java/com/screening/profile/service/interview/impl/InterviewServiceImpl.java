package com.screening.profile.service.interview.impl;

import com.screening.profile.dto.InterviewDTO;
import com.screening.profile.dto.InterviewerPageResponseDTO;
import com.screening.profile.model.*;
import com.screening.profile.repository.AdminRepository;
import com.screening.profile.model.Interview;
import com.screening.profile.model.JobApplication;
import com.screening.profile.repository.InterviewRepository;
import com.screening.profile.service.PerplexityService;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.interview.InterviewService;
import com.screening.profile.util.SetInterviewerRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class InterviewServiceImpl implements InterviewService {


   private final InterviewRepository interviewRepository;
   private final CandidateService candidateService;
   private final PerplexityService perplexityService;
   private AdminRepository adminRepository;

    public InterviewServiceImpl(InterviewRepository interviewRepository, CandidateService candidateService, PerplexityService perplexityService, AdminRepository adminRepository) {
        this.interviewRepository = interviewRepository;
        this.candidateService = candidateService;
        this.perplexityService = perplexityService;
        this.adminRepository = adminRepository;
    }

    @Override
    public Interview createInterview(Interview interviewDetails, Long jobAppId) throws IOException, InterruptedException {

        Optional<Interview> savedInterview = interviewRepository.findByJobApplicationId(jobAppId);
        if(savedInterview.isPresent()) {
            Interview interview = savedInterview.get();
            interview.setId(savedInterview.get().getId());
            interview.setRound1Details(interviewDetails.getRound1Details());
            interview.setRound2Details(interviewDetails.getRound2Details());
            interview.setRound3Details(interviewDetails.getRound3Details());
            if(interview.getRound3Details()!= null){
                interview.setRound3Done(true);
            }
            else if(interview.getRound2Details()!= null){
                interview.setRound2Done(true);
            }
            else if(interview.getRound1Details()!= null){
                interview.setRound1Done(true);
            }
            interview.setJobApplication(interviewDetails.getJobApplication());
            String feedback = getSummarizedFeedback(interviewDetails);
            interview.setFeedback(feedback);
            return interviewRepository.save(interview);
        }
        return interviewRepository.save(interviewDetails);
    }

    @Override
    public List<InterviewDTO> getAllInterviews(){
        List<InterviewDTO> interviewList = interviewRepository.findAll().stream()
                .map(interview -> {
                    InterviewDTO dto = new InterviewDTO();
                    dto.setId(interview.getId());
                    dto.setRound1Details(interview.getRound1Details());
                    dto.setRound2Details(interview.getRound2Details());
                    dto.setRound3Details(interview.getRound3Details());
                    dto.setFeedback(interview.getFeedback());

                    JobApplication ja = interview.getJobApplication();
                    dto.setCandidateId(Math.toIntExact(ja.getCandidate().getId()));
                    dto.setJobApplicationId(ja.getId());
                    dto.setJobId(ja.getJob().getId());
                    return dto;
                })
                .toList();
        log.info("Number of Interviews : {}", interviewList.size());
        return interviewList;
    }

    @Override
    public Interview setInterviewer(Integer interviewId, SetInterviewerRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        Admin interviewer = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        switch (request.getRound()) {
            case 1 -> interview.setRound1Interviewer(interviewer);
            case 2 -> interview.setRound2Interviewer(interviewer);
            case 3 -> interview.setRound3Interviewer(interviewer);
            default -> throw new IllegalArgumentException("Invalid round number: " + request.getRound());
        }

        return interviewRepository.save(interview);
    }


    @Override
    public List<InterviewerPageResponseDTO> findPendingInterviewsForInterviewer(String email) {
        Optional<Admin> interviewer= adminRepository.findByEmail(email);
        Long interviewerId= interviewer.get().getId();
        List<Interview> interviews = interviewRepository.findPendingInterviewsByAdminId(interviewerId);

        return interviews.stream().map(i -> {
            Candidate c = i.getJobApplication().getCandidate();
            Job j = i.getJobApplication().getJob();

            InterviewerPageResponseDTO.CandidateInfo candidateDto =
                    new InterviewerPageResponseDTO.CandidateInfo(
                        c.getId(), 
                        c.getName(), 
                        c.getEmail(), 
                        c.getPhoneNumber(), 
                        c.getDateOfBirth(), 
                        c.getFileData(),
                        c.getScore(),
                        c.getSummary(),
                        c.getUniqueId(),
                        c.getMatchedSkills(),
                        c.getResumeText()
                    );

            InterviewerPageResponseDTO.JobApplicationInfo jobAppDto =
                    new InterviewerPageResponseDTO.JobApplicationInfo(i.getJobApplication().getId(), j.getTitle(), j.getLocation());

            return new InterviewerPageResponseDTO(
                    i.getId(),
                    i.getFeedback(),
                    candidateDto,
                    jobAppDto,
                    i.getRound1Details(),
                    i.getRound2Details(),
                    i.getRound3Details()
            );
        }).toList();
    }

    @Override
    public List<InterviewerPageResponseDTO> findCompletedInterviewsForInterviewer(String email) {
        Optional<Admin> interviewer= adminRepository.findByEmail(email);
        Long interviewerId= interviewer.get().getId();
        List<Interview> interviews = interviewRepository.findCompletedInterviewsByAdminId(interviewerId);

        return interviews.stream().map(i -> {
            Candidate c = i.getJobApplication().getCandidate();
            Job j = i.getJobApplication().getJob();

            InterviewerPageResponseDTO.CandidateInfo candidateDto =
                    new InterviewerPageResponseDTO.CandidateInfo(
                        c.getId(), 
                        c.getName(), 
                        c.getEmail(), 
                        c.getPhoneNumber(), 
                        c.getDateOfBirth(), 
                        c.getFileData(),
                        c.getScore(),
                        c.getSummary(),
                        c.getUniqueId(),
                        c.getMatchedSkills(),
                        c.getResumeText()
                    );

            InterviewerPageResponseDTO.JobApplicationInfo jobAppDto =
                    new InterviewerPageResponseDTO.JobApplicationInfo(i.getJobApplication().getId(), j.getTitle(), j.getLocation());

            return new InterviewerPageResponseDTO(
                    i.getId(),
                    i.getFeedback(),
                    candidateDto,
                    jobAppDto,
                    i.getRound1Details(),
                    i.getRound2Details(),
                    i.getRound3Details()
            );
        }).toList();
    }

    private String getSummarizedFeedback(Interview interviewDetails) throws IOException, InterruptedException {

        String feedback1 = "";
        String feedback2 = "";
        String feedback3 = "";

        if(Optional.ofNullable(interviewDetails.getRound3Details()).isPresent()) {
            feedback3 = feedback3 + interviewDetails.getRound3Details().getFeedback();
        }
        if(Optional.ofNullable(interviewDetails.getRound2Details()).isPresent()){
            feedback2 = feedback2 + interviewDetails.getRound2Details().getFeedback();
        }
        if(Optional.ofNullable(interviewDetails.getRound1Details()).isPresent()){
            feedback1 = feedback1 + interviewDetails.getRound1Details().getFeedback();
        }
        String finalFeedback = feedback1 + System.lineSeparator() + feedback2 + System.lineSeparator() + feedback3;

        return this.perplexityService.askPerplexityForSummarizedFeedback(finalFeedback);
    }
}

