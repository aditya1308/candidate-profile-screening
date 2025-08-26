package com.screening.profile.service;

import com.screening.profile.model.JobApplication;
import java.util.List;

public interface JobApplicationService {
    JobApplication applyForJob(Integer jobId, Long candidateId);
    boolean hasAlreadyApplied(Integer jobId, Long candidateId);
    List<JobApplication> getApplicationsByCandidate(Long candidateId);
    List<JobApplication> getApplicationsByJob(Integer jobId);
    JobApplication updateApplicationStatus(Integer applicationId, String status);
}
