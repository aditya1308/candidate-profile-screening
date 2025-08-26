package com.screening.profile.service.interview;

import com.screening.profile.model.Candidate;
import com.screening.profile.model.Interview;

public interface InterviewService {
    Interview createInterview(Interview interviewDetails, Long candidateId);

}
