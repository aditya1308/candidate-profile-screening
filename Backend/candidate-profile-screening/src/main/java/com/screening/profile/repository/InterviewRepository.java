package com.screening.profile.repository;

import com.screening.profile.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    Optional<Interview> findByJobApplicationId(Long jobAppId);

}
