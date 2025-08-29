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
            "WHERE i.round1Interviewer.email = :email " +
            "   OR i.round2Interviewer.email = :email " +
            "   OR i.round3Interviewer.email = :email")
    List<Interview> findByInterviewerEmail(@Param("email") String email);


}
