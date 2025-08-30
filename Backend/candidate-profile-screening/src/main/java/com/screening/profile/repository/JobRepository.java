package com.screening.profile.repository;

import com.screening.profile.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(j.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Job> searchByTitleOrLocation(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Job> findByTitleContainingIgnoreCaseOrRequiredSkillsContainingIgnoreCase(@Param("searchTerm") String searchTerm);
}
