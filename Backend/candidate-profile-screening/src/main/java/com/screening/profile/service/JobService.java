package com.screening.profile.service;

import com.screening.profile.model.Job;
import java.util.List;

public interface JobService {
    List<Job> getAllJobs();
    List<Job> searchJobs(String searchTerm);
    Job saveJob(Job job);
}
