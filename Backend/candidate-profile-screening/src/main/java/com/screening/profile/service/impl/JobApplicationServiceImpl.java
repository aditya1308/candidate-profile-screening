package com.screening.profile.service.impl;

import com.screening.profile.exception.ServiceException;
import com.screening.profile.model.Candidate;
import com.screening.profile.model.Job;
import com.screening.profile.model.JobApplication;
import com.screening.profile.repository.CandidateRepository;
import com.screening.profile.repository.JobApplicationRepository;
import com.screening.profile.repository.JobRepository;
import com.screening.profile.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {
    
    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    
    @Autowired
    public JobApplicationServiceImpl(JobApplicationRepository jobApplicationRepository,
                                     JobRepository jobRepository,
                                     CandidateRepository candidateRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
    }
    
    @Override
    public JobApplication applyForJob(Integer jobId, Long candidateId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ServiceException("JOB_NOT_FOUND", "Job not found"));
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ServiceException("CANDIDATE_NOT_FOUND", "Candidate not found"));
        
        if (hasAlreadyApplied(jobId, candidateId)) {
            throw new ServiceException("DUPLICATE_APPLICATION", "Candidate has already applied for this job");
        }
        
        JobApplication application = new JobApplication(job, candidate, "Applied");
        return jobApplicationRepository.save(application);
    }
    
    @Override
    public boolean hasAlreadyApplied(Integer jobId, Long candidateId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ServiceException("JOB_NOT_FOUND", "Job not found"));
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ServiceException("CANDIDATE_NOT_FOUND", "Candidate not found"));
        return jobApplicationRepository.existsByJobAndCandidate(job, candidate);
    }
    
    @Override
    public List<JobApplication> getApplicationsByCandidate(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ServiceException("CANDIDATE_NOT_FOUND", "Candidate not found"));
        return jobApplicationRepository.findByCandidate(candidate);
    }
    
    @Override
    public List<JobApplication> getApplicationsByJob(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ServiceException("JOB_NOT_FOUND", "Job not found"));
        return jobApplicationRepository.findByJob(job);
    }
    
    @Override
    public JobApplication updateApplicationStatus(Integer applicationId, String status) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new ServiceException("NOT_FOUND", "Application not found"));
        application.setStatus(status);
        return jobApplicationRepository.save(application);
    }
}
