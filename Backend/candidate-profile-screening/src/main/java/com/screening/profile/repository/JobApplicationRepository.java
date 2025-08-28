package com.screening.profile.repository;

import com.screening.profile.model.Candidate;
import com.screening.profile.model.Job;
import com.screening.profile.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    boolean existsByJobAndCandidate(Job job, Candidate candidate);
    List<JobApplication> findByCandidate(Candidate candidate);
    List<JobApplication> findByJob(Job job);
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByCandidateId(Long candidateId);

    @Query("SELECT c FROM Candidate c JOIN JobApplication a ON c.id = a.candidate.id WHERE a.job.id = :jobId")
    List<Candidate> findCandidatesByJobId(@Param("jobId") Long jobId);

}
