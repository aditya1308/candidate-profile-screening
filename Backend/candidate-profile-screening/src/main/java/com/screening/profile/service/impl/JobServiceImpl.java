package com.screening.profile.service.impl;

import com.screening.profile.model.Job;
import com.screening.profile.repository.JobRepository;
import com.screening.profile.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
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

    @Override
    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public Optional<Job> getJob(Integer id) {
        return jobRepository.findById(id);
    }

    @Override
    public String getJobDescription(Integer id) {
        String jobDescription = "";
        Optional<Job> job = jobRepository.findById(id);
        if(job.isPresent()){
            jobDescription = job.get().getDescription();
        } else{
            log.error("No job present for this id");
        }
        return jobDescription;
    }

}
