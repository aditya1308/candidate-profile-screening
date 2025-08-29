package com.screening.profile.service.interview;

import com.screening.profile.dto.InterviewDTO;
import com.screening.profile.model.Interview;
import com.screening.profile.util.SetInterviewerRequest;

import java.io.IOException;
import java.util.List;

public interface InterviewService {
    Interview createInterview(Interview interviewDetails, Long jobAppId) throws IOException, InterruptedException;
    List<InterviewDTO> getAllInterviews();
    List<Interview> getInterviewsForInterviewer(String email);
    Interview setInterviewer(Integer id, SetInterviewerRequest request);
}
