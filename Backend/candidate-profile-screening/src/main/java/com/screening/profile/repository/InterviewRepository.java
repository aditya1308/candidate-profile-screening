package com.screening.profile.repository;

import com.screening.profile.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    Optional<Interview> findByJobApplicationId(Long jobAppId);

    @Query("SELECT i FROM Interview i " +
            "WHERE (i.round1Interviewer.email = :email AND i.round1Details IS NULL) " +
            "   OR (i.round2Interviewer.email = :email AND i.round2Details IS NULL) " +
            "   OR (i.round3Interviewer.email = :email AND i.round3Details IS NULL)")
    List<Interview> findPendingInterviewsForInterviewer(@Param("email") String email);

    @Query("SELECT i FROM Interview i " +
            "WHERE (i.round1Interviewer.email = :email AND i.round1Details IS NOT NULL) " +
            "   OR (i.round2Interviewer.email = :email AND i.round2Details IS NOT NULL) " +
            "   OR (i.round3Interviewer.email = :email AND i.round3Details IS NOT NULL)")
    List<Interview> findCompletedInterviewsForInterviewer(@Param("email") String email);

}
