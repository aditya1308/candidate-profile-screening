package com.screening.profile.repository;

import com.screening.profile.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    Optional<Interview> findByJobApplicationId(Long jobAppId);

    @Query(value = """
        SELECT i.*
        FROM interview i
        JOIN admin a ON (
            i.round1_interviewer_id = a.id
            OR i.round2_interviewer_id = a.id
            OR i.round3_interviewer_id = a.id
        )
        WHERE a.email = :email
          AND (
              i.round1_details IS NULL
              OR i.round2_details IS NULL
              OR i.round3_details IS NULL
          )
    """, nativeQuery = true)
    List<Interview> findPendingInterviewsForInterviewer(@Param("email") String email);

    @Query("SELECT i FROM Interview i " +
            "WHERE (i.round1Interviewer.email = :email AND i.round1Details IS NOT NULL) " +
            "   OR (i.round2Interviewer.email = :email AND i.round2Details IS NOT NULL) " +
            "   OR (i.round3Interviewer.email = :email AND i.round3Details IS NOT NULL)")
    List<Interview> findCompletedInterviewsForInterviewer(@Param("email") String email);

}
