package com.screening.profile.service.interview.impl;

import com.screening.profile.model.Candidate;
import com.screening.profile.model.Feedback;
import com.screening.profile.model.Interview;
import com.screening.profile.repository.InterviewRepository;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.interview.InterviewService;
import com.screening.profile.util.enums.Status;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InterviewServiceImpl implements InterviewService {


   private final InterviewRepository interviewRepository;
   private final CandidateService candidateService;

    public InterviewServiceImpl(InterviewRepository interviewRepository, CandidateService candidateService) {
        this.interviewRepository = interviewRepository;
        this.candidateService = candidateService;
    }

    @Override
    public Interview createInterview(Interview interviewDetails, Long candidateId) {
        Status status = getStatusFromInterviewer(interviewDetails);
        Candidate candidate = candidateService.getCandidateById(candidateId);
        candidate.setStatus(status);
        candidateService.saveCandidate(candidate);
        interviewRepository.save(interviewDetails);
        return interviewDetails;
    }

    private Status getStatusFromInterviewer(Interview interviewDetails){
        Status status = Status.REJECTED;
        Feedback feedbackRound3 = interviewDetails.getRound3Details();
        Feedback feedbackRound2 = interviewDetails.getRound2Details();
        Feedback feedbackRound1 = interviewDetails.getRound1Details();
        if(Optional.ofNullable(feedbackRound3.getStatus()).isPresent()) {
            status = Status.valueOf(feedbackRound3.getStatus());
        } else if(Optional.ofNullable(feedbackRound2.getStatus()).isPresent()){
            status = Status.valueOf(feedbackRound2.getStatus());
        } else if(Optional.ofNullable(feedbackRound1.getStatus()).isPresent()){
            status = Status.valueOf(feedbackRound1.getStatus());
        }
        return status;
    }
}

