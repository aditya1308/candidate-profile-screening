package com.screening.profile.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.screening.profile.dto.CandidateInterviewDTO;
import com.screening.profile.dto.CandidateProcessingDTO;
import com.screening.profile.dto.CandidateReqDTO;
import com.screening.profile.dto.JobMatchScoreDTO;
import com.screening.profile.dto.ResumeAutofillDTO;
import com.screening.profile.exception.ServiceException;
import com.screening.profile.model.Candidate;
import com.screening.profile.service.PerplexityService;
import com.screening.profile.service.candidate.CandidateService;
import com.screening.profile.service.interview.InterviewService;
import com.screening.profile.util.SetInterviewerRequest;
import com.screening.profile.util.enums.Status;
import com.screening.profile.util.ExtractorHelperUtils;
import com.screening.profile.util.parser.PdfParsingUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.time.LocalDate;

@RestController
@CrossOrigin("*")
@Slf4j
@RequestMapping("api/v1")
public class JobMatchController {

    private static final long MAX_RESUME_SIZE = 5 * 1024 * 1024;
    private final PerplexityService perplexityService;
    private final CandidateService candidateService;
    private final InterviewService interviewService;

    @Autowired
    public JobMatchController(PerplexityService perplexityService, CandidateService candidateService,
                              InterviewService interviewService) {
        this.perplexityService = perplexityService;
        this.candidateService = candidateService;
        this.interviewService = interviewService;
    }

    @PostMapping("/apply-job")
    public ResponseEntity<?> analyze(@RequestParam("resumePdf") MultipartFile resumePdf,
                                     @RequestParam("jobId") Long jobId,
                                     @RequestParam String name,
                                     @RequestParam String phoneNumber,
                                     @RequestParam String dob,
                                     @RequestParam(defaultValue = "false") boolean consent) throws Exception {
        ResponseEntity<?> fileValidation = validateResume(resumePdf);
        if (fileValidation != null) return fileValidation;
        String authenticatedEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean validDateOfBirth;
        try {
            LocalDate parsedDob = LocalDate.parse(dob);
            validDateOfBirth = parsedDob.getYear() >= 1950 && !parsedDob.isAfter(LocalDate.now());
        } catch (RuntimeException e) {
            validDateOfBirth = false;
        }
        if (name == null || name.isBlank() || phoneNumber == null || !phoneNumber.matches("\\d{10}")
                || authenticatedEmail == null || authenticatedEmail.isBlank() || !validDateOfBirth || !consent) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "Full name, a valid 10-digit phone number, date of birth, and personal data consent are required."));
        }

        log.info("JobController, file received");
        CandidateReqDTO candidateReqDTO = new CandidateReqDTO();
        candidateReqDTO.setName(name.trim());
        candidateReqDTO.setEmail(authenticatedEmail);
        candidateReqDTO.setPhoneNumber(phoneNumber);
        candidateReqDTO.setDob(dob);
        String resumeText = PdfParsingUtil.extractText(resumePdf);
        if (resumeText == null || resumeText.isBlank()) {
            return ResponseEntity.unprocessableEntity()
                    .body(Map.of("message", "No readable text was found in this PDF. Please upload a text-based PDF."));
        }
        String resumeEmail = ExtractorHelperUtils.extractEmail(resumeText);
        if (resumeEmail != null && !resumeEmail.equalsIgnoreCase(authenticatedEmail)) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "The email address in the resume does not match your account email."));
        }
        candidateReqDTO.setResumeText(resumeText);

        Candidate candidate = this.perplexityService.askGeminiForPrompt(resumePdf, jobId, candidateReqDTO);
        if (candidate == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Candidate already exists for this job description");
        }
        return ResponseEntity.ok().body(candidate);
    }

    @PostMapping("/parse-resume")
    public ResponseEntity<?> parseResume(@RequestParam("resumePdf") MultipartFile resumePdf,
                                         @RequestParam("jobId") Long jobId) {
        ResponseEntity<?> fileValidation = validateResume(resumePdf);
        if (fileValidation != null) return fileValidation;

        try {
            String resumeText = PdfParsingUtil.extractText(resumePdf);
            if (resumeText == null || resumeText.isBlank()) {
                return ResponseEntity.unprocessableEntity()
                        .body(Map.of("message", "No readable text was found in this PDF. Please upload a text-based PDF."));
            }
            ResumeAutofillDTO details = perplexityService.extractResumeDetails(resumeText, jobId);
            details.setEmail(ExtractorHelperUtils.extractEmail(resumeText));
            return ResponseEntity.ok(details);
        } catch (ServiceException e) {
            log.error("Resume detail extraction failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", e.getMessage()));
        } catch (java.io.IOException e) {
            log.warn("Could not read uploaded resume PDF: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "The uploaded PDF could not be read."));
        } catch (Exception e) {
            log.error("Resume detail extraction failed", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Resume information could not be extracted. Please try again or upload another PDF."));
        }
    }

    @PostMapping(value = "/match-jobs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> matchJobs(@RequestParam("resumePdf") MultipartFile resumePdf) {
        ResponseEntity<?> fileValidation = validateResume(resumePdf);
        if (fileValidation != null) return fileValidation;

        try {
            String resumeText = PdfParsingUtil.extractText(resumePdf);
            if (resumeText == null || resumeText.isBlank()) {
                return ResponseEntity.unprocessableEntity()
                        .body(Map.of("message", "No readable text was found in this PDF. Please upload a text-based PDF."));
            }
            List<JobMatchScoreDTO> matches = perplexityService.matchResumeToJobs(resumeText);
            return ResponseEntity.ok(matches);
        } catch (ServiceException e) {
            log.error("Resume-to-job matching failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", e.getMessage()));
        } catch (java.io.IOException e) {
            log.warn("Could not read uploaded resume PDF: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "The uploaded PDF could not be read."));
        } catch (Exception e) {
            log.error("Resume-to-job matching failed", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Job matches could not be generated. Please try again."));
        }
    }

    private ResponseEntity<?> validateResume(MultipartFile resumePdf) {
        if (resumePdf == null || resumePdf.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "A PDF resume is required."));
        }
        String filename = resumePdf.getOriginalFilename();
        if (filename == null || !filename.toLowerCase(Locale.ROOT).endsWith(".pdf")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Unsupported file type. Please upload a PDF."));
        }
        if (resumePdf.getSize() > MAX_RESUME_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("message", "The PDF must be 5MB or smaller."));
        }
        return null;
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
        if(candidate == null)
        {
            candidate = java.util.Collections.emptyList();
        }
        return ResponseEntity.status(HttpStatus.OK).body(candidate);
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<?> bulkUpload(@RequestParam("resumePdf") List<MultipartFile> resumePdf, @RequestParam("jobId") Long jobId) throws Exception {

        long startTime = System.currentTimeMillis();
        log.info("JobController copy, file received");
        CandidateProcessingDTO candidate = this.perplexityService.askGeminiAndGetParallelResponse(resumePdf, jobId);
        if (candidate == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error in controller");
        }
        long endTime = System.currentTimeMillis();
        long timeTaken = endTime - startTime;
        log.info("Total time taken for execution : {}", timeTaken);
        return ResponseEntity.ok().body(candidate);
    }
}
