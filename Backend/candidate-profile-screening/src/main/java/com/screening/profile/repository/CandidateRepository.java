package com.screening.profile.repository;

import com.screening.profile.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByUniqueId(String uniqueId);

    @Query(value = "SELECT c.*, i.feedback_summary, " +
            "i.round1_details->>'$.feedback' AS round1_feedback, " +
            "i.round2_details->>'$.feedback' AS round2_feedback, " +
            "i.round3_details->>'$.feedback' AS round3_feedback " +
            "FROM candidate c " +
            "LEFT JOIN job_application ja ON ja.candidate_id = c.id AND ja.job_id = :jobId " +
            "LEFT JOIN interview i ON i.job_application_id = ja.id",
            nativeQuery = true)
    List<Object[]> findCandidatesWithInterviewFeedbackByJobId(@Param("jobId") Integer jobId);
}
