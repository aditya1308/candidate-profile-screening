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
            "i.id," +
            "i.round1_details->>'$.feedback' AS round1_feedback, " +
            "i.round2_details->>'$.feedback' AS round2_feedback, " +
            "i.round3_details->>'$.feedback' AS round3_feedback " +
            "FROM candidate c " +
            "INNER JOIN job_application ja ON ja.candidate_id = c.id AND ja.job_id = :jobId " +
            "LEFT JOIN interview i ON i.job_application_id = ja.id",
            nativeQuery = true)
    List<Object[]> findCandidatesWithInterviewFeedbackByJobId(@Param("jobId") Integer jobId);
    @Query(value = """
    SELECT c.*, 
           MATCH(c.resume_text) AGAINST (:resume IN NATURAL LANGUAGE MODE) AS relevance
    FROM candidate c
    INNER JOIN job_application ja ON c.id = ja.candidate_id
    WHERE ja.job_id = :jobId
      AND MATCH(c.resume_text) AGAINST (:resume IN NATURAL LANGUAGE MODE)
    ORDER BY relevance DESC
    LIMIT 10
""", nativeQuery = true)
    List<Candidate> findTopCandidatesByResumeTextAndJob(
            @Param("resume") String resume,
            @Param("jobId") Long jobId
    );
    List<Optional<Candidate>> findByEmail(String email);
}
