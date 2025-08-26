package com.screening.profile.controller;

import com.screening.profile.model.Candidate;
import com.screening.profile.service.PerplexityService;
import com.screening.profile.service.candidate.CandidateService;
import jakarta.persistence.criteria.CriteriaBuilder;
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

    @Autowired
    public JobMatchController(PerplexityService perplexityService, CandidateService candidateService) {
        this.perplexityService = perplexityService;
        this.candidateService = candidateService;
    }

    @PostMapping("/analyze-job")
    public ResponseEntity<?> analyze(@RequestParam("resumePdf") MultipartFile resumePdf, @RequestParam("jobId") Integer jobId) throws Exception {
        log.info("JobController, file received");
        Candidate candidate = this.perplexityService.askPerplexityForPrompt(resumePdf, jobId);
        if (candidate == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Candidate already exists for this job description");
        }
        return ResponseEntity.ok().body(candidate);
    }

    @GetMapping("/candidates")
    public ResponseEntity<?> getAllCandidates(){
        return ResponseEntity.status(HttpStatus.OK).body(candidateService.getAllCandidates());
    }

    @GetMapping("/candidate/{id}")
    public ResponseEntity<?> getAllCandidatesById(@PathVariable("id") Long id){
        Candidate candidate = this.candidateService.getCandidateById(id);
        if(candidate == null)
        {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No candidate found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(candidate);
    }

}
