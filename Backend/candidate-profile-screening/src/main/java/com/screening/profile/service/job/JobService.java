package com.screening.profile.service.job;

import com.screening.profile.model.Job;
import java.util.List;
import java.util.Optional;

public interface JobService {
    List<Job> getAllJobs();
    List<Job> searchJobs(String searchTerm);
    Job saveJob(Job job);
    Optional<Job> getJob(Integer id);
    String getJobDescription(Long id);
}
