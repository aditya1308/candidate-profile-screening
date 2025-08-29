package com.screening.profile.service.interview.impl;

import com.screening.profile.dto.InterviewDTO;
import com.screening.profile.model.Feedback;
import com.screening.profile.model.Interview;
import com.screening.profile.model.JobApplication;
import com.screening.profile.repository.InterviewRepository;
import com.screening.profile.service.PerplexityService;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.interview.InterviewService;
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

    public InterviewServiceImpl(InterviewRepository interviewRepository, CandidateService candidateService, PerplexityService perplexityService) {
        this.interviewRepository = interviewRepository;
        this.candidateService = candidateService;
        this.perplexityService = perplexityService;
    }

    @Override
    public Interview createInterview(Interview interviewDetails, Long interviewId) throws IOException, InterruptedException {
        Optional<Interview> savedInterview = interviewRepository.findById(Math.toIntExact(interviewId));
        if(savedInterview.isPresent()) {
            Interview interview = savedInterview.get();
            interview.setRound1Details(interviewDetails.getRound1Details());
            interview.setRound2Details(interviewDetails.getRound2Details());
            interview.setRound3Details(interviewDetails.getRound3Details());
            interview.setJobApplication(interviewDetails.getJobApplication());
            String feedback = getSummarizedFeedback(interviewDetails);
            interview.setFeedback(feedback);
            interviewRepository.save(interview);
            return interview;
        }
        return null;
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

    private String getSummarizedFeedback(Interview interviewDetails) throws IOException, InterruptedException {

        String feedback1 = "";
        String feedback2 = "";
        String feedback3 = "";

        Feedback feedbackRound3 = interviewDetails.getRound3Details();
        Feedback feedbackRound2 = interviewDetails.getRound2Details();
        Feedback feedbackRound1 = interviewDetails.getRound1Details();

        if(Optional.ofNullable(feedbackRound3.getStatus()).isPresent()) {
            feedback3 = feedback3 + feedbackRound3.getFeedback();
        }
        if(Optional.ofNullable(feedbackRound2.getStatus()).isPresent()){
            feedback2 = feedback2 + feedbackRound2.getFeedback();
        }
        if(Optional.ofNullable(feedbackRound1.getStatus()).isPresent()){
            feedback1 = feedback1 + feedbackRound1.getFeedback();
        }
        String finalFeedback = feedback1 + System.lineSeparator() + feedback2 + System.lineSeparator() + feedback3;

        return this.perplexityService.askPerplexityForSummarizedFeedback(finalFeedback);
    }
}

