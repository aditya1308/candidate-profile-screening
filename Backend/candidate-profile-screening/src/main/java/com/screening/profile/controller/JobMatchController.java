package com.screening.profile.controller;

import com.screening.profile.dto.CandidateReqDTO;
import com.screening.profile.model.Candidate;
import com.screening.profile.service.PerplexityService;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.util.enums.Status;
import com.screening.profile.util.parser.PdfParsingUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @PostMapping("/apply-job")
    public ResponseEntity<?> analyze(@RequestParam("resumePdf") MultipartFile resumePdf, @RequestParam("jobId") Long jobId, @RequestParam String name,
                                     @RequestParam String email, @RequestParam String phoneNumber, @RequestParam String dob) throws Exception {
        log.info("JobController, file received");
        CandidateReqDTO candidateReqDTO = new CandidateReqDTO();
        candidateReqDTO.setName(name);
        candidateReqDTO.setEmail(email);
        candidateReqDTO.setPhoneNumber(phoneNumber);
        candidateReqDTO.setDob(dob);
        candidateReqDTO.setResumeText(PdfParsingUtil.extractText(resumePdf));

        Candidate candidate = this.perplexityService.askPerplexityForPrompt(resumePdf, jobId, candidateReqDTO);
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


    @PutMapping("/update-status")
    public ResponseEntity<?> getAllCandidatesByJobId(@RequestParam("id") Long id, @RequestParam("status") Status status){
        boolean updateStatus = this.candidateService.updateCandidateStatus(id, status);
        if(!updateStatus)
        {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Status update failed");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Status updated successfully");
    }

    @GetMapping("/all-candidates/{id}")
    public ResponseEntity<?> getAllCandidatesByJobId(@PathVariable("id") Long id){
        List<Candidate> candidate = this.candidateService.getAllCandidatesByJobId(id);
        if(candidate == null || candidate.isEmpty())
        {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No candidate found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(candidate);
    }
}
