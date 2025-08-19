package com.screening.profile.service.impl;

import com.screening.profile.model.Job;
import com.screening.profile.repository.JobRepository;
import com.screening.profile.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public List<Job> searchJobs(String searchTerm) {
        return jobRepository.searchByTitleOrLocation(searchTerm);
    }
}
