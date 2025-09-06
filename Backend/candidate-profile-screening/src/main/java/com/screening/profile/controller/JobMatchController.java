package com.screening.profile.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.screening.profile.dto.CandidateInterviewDTO;
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
import com.screening.profile.service.interview.InterviewService;
import com.screening.profile.util.SetInterviewerRequest;

@RestController
@CrossOrigin("*")
@Slf4j
@RequestMapping("api/v1")
public class JobMatchController {

    private final PerplexityService perplexityService;
    private final CandidateService candidateService;
    private final InterviewService interviewService;

    @Autowired
    public JobMatchController(PerplexityService perplexityService, CandidateService candidateService, InterviewService interviewService) {
        this.perplexityService = perplexityService;
        this.candidateService = candidateService;
        this.interviewService = interviewService;
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
    public ResponseEntity<?> getAllCandidatesByJobId(@RequestParam("id") Long id, 
                                                   @RequestParam("status") Status status,
                                                   @RequestParam(value = "interviewId", required = false) Integer interviewId,
                                                   @RequestParam(value = "interviewerEmail", required = false) String interviewerEmail) {
        boolean updateStatus = this.candidateService.updateCandidateStatus(id, status);
        if(!updateStatus)
        {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Status update failed");
        }
        
        // If status is one of the round-specific statuses and both interviewId and interviewerEmail are provided, call set-interview endpoint
        if (interviewId != null && interviewerEmail != null && !interviewerEmail.isEmpty() && 
            (status == Status.IN_PROCESS_ROUND1 || status == Status.IN_PROCESS_ROUND2 || status == Status.IN_PROCESS_ROUND3)) {
            
            try {
                // Determine the round number based on status
                int round = 0;
                switch (status) {
                    case IN_PROCESS_ROUND1 -> round = 1;
                    case IN_PROCESS_ROUND2 -> round = 2;
                    case IN_PROCESS_ROUND3 -> round = 3;
                    default -> round = 0;
                }
                
                // Create SetInterviewerRequest
                SetInterviewerRequest request = new SetInterviewerRequest();
                request.setRound(round);
                request.setEmail(interviewerEmail);
                
                // Call setInterviewer
                interviewService.setInterviewer(interviewId, request);
                log.info("Interviewer set successfully for interview {} in round {}", interviewId, round);
            } catch (Exception e) {
                log.error("Error setting interviewer for interview {}: {}", interviewId, e.getMessage());
                // Don't fail the status update if interviewer setting fails
            }
        }
        
        return ResponseEntity.status(HttpStatus.OK).body("Status updated successfully");
    }

    @GetMapping("/all-candidates/{id}")
    public ResponseEntity<?> getAllCandidatesByJobId(@PathVariable("id") Long id) throws JsonProcessingException {
        List<CandidateInterviewDTO> candidate = this.candidateService.getCandidatesWithInterviewFeedbackByJobId(id);
        if(candidate == null || candidate.isEmpty())
        {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No candidate found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(candidate);
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<?> bulkUpload(@RequestParam("resumePdf") List<MultipartFile> resumePdf, @RequestParam("jobId") Long jobId) throws Exception {
        long startTime = System.currentTimeMillis();

        log.info("JobController copy, file received");


        List<Candidate> candidate = this.perplexityService.askPerplexityAndGetParallelResponse(resumePdf, jobId);
        if (candidate == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Error in controller");
        }
        long endTime = System.currentTimeMillis();
        long timeTaken = endTime - startTime;
        log.info("Total time taken for execution : {}", timeTaken);
        return ResponseEntity.ok().body(candidate);
    }
}
