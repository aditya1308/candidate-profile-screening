package com.screening.profile.service.interview;

import com.screening.profile.dto.InterviewDTO;
import com.screening.profile.model.Interview;

import java.util.List;

public interface InterviewService {
    Interview createInterview(Interview interviewDetails, Long candidateId);
    List<InterviewDTO> getAllInterviews();

}
