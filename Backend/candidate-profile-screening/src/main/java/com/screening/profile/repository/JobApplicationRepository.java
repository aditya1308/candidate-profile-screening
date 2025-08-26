package com.screening.profile.repository;

import com.screening.profile.model.Candidate;
import com.screening.profile.model.Job;
import com.screening.profile.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    boolean existsByJobAndCandidate(Job job, Candidate candidate);
    List<JobApplication> findByCandidate(Candidate candidate);
    List<JobApplication> findByJob(Job job);
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByCandidateId(Long candidateId);
}
