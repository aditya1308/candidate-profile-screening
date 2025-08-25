package com.screening.profile.service.impl;

import com.screening.profile.exception.ServiceException;
import com.screening.profile.model.JobApplication;
import com.screening.profile.repository.JobApplicationRepository;
import com.screening.profile.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {
    
    private final JobApplicationRepository jobApplicationRepository;
    
    @Autowired
    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }
    
    @Override
    public JobApplication applyForJob(Integer jobId, Long candidateId) {
        // Check if candidate has already applied for this job
        if (hasAlreadyApplied(jobId, candidateId)) {
            throw new ServiceException("DUPLICATE_APPLICATION", 
                "Candidate has already applied for this job");
        }
        
        JobApplication application = new JobApplication(jobId, candidateId, "Applied");
        return jobApplicationRepository.save(application);
    }
    
    @Override
    public boolean hasAlreadyApplied(Integer jobId, Long candidateId) {
        return jobApplicationRepository.existsByJobIdAndCandidateId(jobId, candidateId);
    }
    
    @Override
    public List<JobApplication> getApplicationsByCandidate(Long candidateId) {
        return jobApplicationRepository.findByCandidateId(candidateId);
    }
    
    @Override
    public List<JobApplication> getApplicationsByJob(Integer jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }
    
    @Override
    public JobApplication updateApplicationStatus(Integer applicationId, String status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new ServiceException("NOT_FOUND", "Application not found"));
        
        application.setStatus(status);
        return jobApplicationRepository.save(application);
    }
}
