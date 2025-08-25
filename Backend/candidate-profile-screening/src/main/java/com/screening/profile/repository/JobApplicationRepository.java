package com.screening.profile.repository;

import com.screening.profile.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.jobId = :jobId AND ja.candidateId = :candidateId")
    Optional<JobApplication> findByJobIdAndCandidateId(@Param("jobId") Integer jobId, @Param("candidateId") Long candidateId);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.candidateId = :candidateId")
    List<JobApplication> findByCandidateId(@Param("candidateId") Long candidateId);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.jobId = :jobId")
    List<JobApplication> findByJobId(@Param("jobId") Integer jobId);
    
    @Query("SELECT COUNT(ja) > 0 FROM JobApplication ja WHERE ja.jobId = :jobId AND ja.candidateId = :candidateId")
    boolean existsByJobIdAndCandidateId(@Param("jobId") Integer jobId, @Param("candidateId") Long candidateId);
}
