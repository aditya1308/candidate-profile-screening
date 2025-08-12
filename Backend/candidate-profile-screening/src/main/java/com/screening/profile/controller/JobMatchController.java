package com.screening.profile.controller;

import com.screening.profile.model.Candidate;
import com.screening.profile.service.PerplexityService;
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

    @Autowired
    public JobMatchController(PerplexityService perplexityService) {
        this.perplexityService = perplexityService;
    }

    @PostMapping("/analyze-job")
    public ResponseEntity<?> analyze(@RequestParam("resumePdf") MultipartFile resumePdf, @RequestParam("jobDescription")String jobDescription) throws Exception {
        log.info("JobController, file received");
        Candidate candidate = this.perplexityService.askPerplexityForPrompt(resumePdf, jobDescription);
        if (candidate == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Candidate already exists for this job description");
        }
        return ResponseEntity.ok().body(this.perplexityService.askPerplexityForPrompt(resumePdf, jobDescription));
    }

}
