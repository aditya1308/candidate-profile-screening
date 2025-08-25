package com.screening.profile.controller;

import com.screening.profile.model.Candidate;
import com.screening.profile.model.JobApplication;
import com.screening.profile.service.PerplexityService;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.JobApplicationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin("*")
@Slf4j
@RequestMapping("api/v1")
public class JobMatchController {

    private final PerplexityService perplexityService;
    private final CandidateService candidateService;
    private final JobApplicationService jobApplicationService;

    @Autowired
    public JobMatchController(PerplexityService perplexityService, 
                            CandidateService candidateService,
                            JobApplicationService jobApplicationService) {
        this.perplexityService = perplexityService;
        this.candidateService = candidateService;
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping("/analyze-job")
    public ResponseEntity<?> analyze(@RequestParam("resumePdf") MultipartFile resumePdf, 
                                   @RequestParam("jobDescription") String jobDescription) throws Exception {
        log.info("JobController, file received");
        Candidate candidate = this.perplexityService.askPerplexityForPrompt(resumePdf, jobDescription);
        if (candidate == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Candidate already exists for this job description");
        }
        return ResponseEntity.ok().body(this.perplexityService.askPerplexityForPrompt(resumePdf, jobDescription));
    }

    @PostMapping("/apply-for-job")
    public ResponseEntity<?> applyForJob(@RequestParam("resumePdf") MultipartFile resumePdf,
                                       @RequestParam("jobId") Integer jobId,
                                       @RequestParam("jobDescription") String jobDescription) throws Exception {
        log.info("Applying for job with ID: {}", jobId);
        
        try {
            // First, analyze the resume and get/create candidate
            Candidate candidate = this.perplexityService.askPerplexityForPrompt(resumePdf, jobDescription);
            if (candidate == null) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Candidate already exists for this job description");
            }
            
            // Check if candidate has already applied for this job
            if (jobApplicationService.hasAlreadyApplied(jobId, candidate.getId())) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Candidate has already applied for this job");
            }
            
            // Apply for the job
            JobApplication application = jobApplicationService.applyForJob(jobId, candidate.getId());
            
            return ResponseEntity.ok().body(application);
            
        } catch (Exception e) {
            log.error("Error applying for job: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing application: " + e.getMessage());
        }
    }
}
