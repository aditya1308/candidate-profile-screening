package com.screening.profile.repository;

import com.screening.profile.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    Optional<Interview> findByJobApplicationId(Long jobAppId);

    @Query("SELECT DISTINCT i FROM Interview i " +
            "JOIN FETCH i.jobApplication ja " +
            "JOIN FETCH ja.job j " +
            "JOIN FETCH ja.candidate c " +
            "WHERE (i.round1Interviewer.id = :adminId AND i.round1Done = false) " +
            "   OR (i.round2Interviewer.id = :adminId AND i.round2Done = false) " +
            "   OR (i.round3Interviewer.id = :adminId AND i.round3Done = false)")
    List<Interview> findPendingInterviewsByAdminId(@Param("adminId") Long adminId);

    @Query("SELECT DISTINCT i FROM Interview i " +
            "JOIN FETCH i.jobApplication ja " +
            "JOIN FETCH ja.job j " +
            "JOIN FETCH ja.candidate c " +
            "WHERE (i.round1Interviewer.id = :adminId AND i.round1Done = true) " +
            "   OR (i.round2Interviewer.id = :adminId AND i.round2Done = true) " +
            "   OR (i.round3Interviewer.id = :adminId AND i.round3Done = true)")
    List<Interview> findCompletedInterviewsByAdminId(@Param("adminId") Long adminId);

    @Modifying
    @Query(value = "DELETE FROM interview i WHERE i.job_application_id = :jobAppId", nativeQuery = true)
    void deleteByJobApplicationId(@Param("jobAppId") Integer jobAppId);

}
