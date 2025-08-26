package com.screening.profile.controller;

import com.screening.profile.model.JobApplication;
import com.screening.profile.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {
    
    private final JobApplicationService jobApplicationService;
    
    @Autowired
    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }
    
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestParam Integer jobId, @RequestParam Long candidateId) {
        try {
            JobApplication application = jobApplicationService.applyForJob(jobId, candidateId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByCandidate(@PathVariable Long candidateId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsByCandidate(candidateId);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByJob(@PathVariable Integer jobId) {
        List<JobApplication> applications = jobApplicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }
    
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Integer applicationId, 
            @RequestParam String status) {
        try {
            JobApplication application = jobApplicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/check")
    public ResponseEntity<Boolean> hasAlreadyApplied(
            @RequestParam Integer jobId, 
            @RequestParam Long candidateId) {
        boolean hasApplied = jobApplicationService.hasAlreadyApplied(jobId, candidateId);
        return ResponseEntity.ok(hasApplied);
    }
}
