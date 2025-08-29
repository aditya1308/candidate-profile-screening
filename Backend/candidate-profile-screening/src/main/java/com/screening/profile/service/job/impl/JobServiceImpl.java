package com.screening.profile.service.job.impl;

import com.screening.profile.model.Job;
import com.screening.profile.repository.JobRepository;
import com.screening.profile.service.job.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public String getJobDescription(Long id) {
        String jobDescription = "";
        Optional<Job> job = jobRepository.findById(Math.toIntExact(id));
        if(job.isPresent()){
            jobDescription = job.get().getDescription();
        } else{
            log.error("No job present for this id");
        }
        return jobDescription;
    }

    @Override
    public Job updateJob(Integer id, Job jobDetails) {
        Optional<Job> existingJob = jobRepository.findById(id);
        if (existingJob.isPresent()) {
            Job job = existingJob.get();
            job.setTitle(jobDetails.getTitle());
            job.setRequiredSkills(jobDetails.getRequiredSkills());
            job.setDescription(jobDetails.getDescription());
            job.setLocation(jobDetails.getLocation());
            return jobRepository.save(job);
        } else {
            log.error("Job not found with id: {}", id);
            throw new RuntimeException("Job not found with id: " + id);
        }
    }

    @Override
    public void deleteJob(Integer id) {
        Optional<Job> existingJob = jobRepository.findById(id);
        if (existingJob.isPresent()) {
            jobRepository.deleteById(id);
            log.info("Job deleted successfully with id: {}", id);
        } else {
            log.error("Job not found with id: {}", id);
            throw new RuntimeException("Job not found with id: " + id);
        }
    }
}
