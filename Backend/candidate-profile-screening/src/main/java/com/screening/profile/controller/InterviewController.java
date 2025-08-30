package com.screening.profile.controller;

import com.screening.profile.dto.InterviewDTO;
import com.screening.profile.dto.InterviewerPageResponseDTO;
import com.screening.profile.model.Interview;
import com.screening.profile.service.interview.InterviewService;
import com.screening.profile.util.SetInterviewerRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interview")
@CrossOrigin("*")
@Slf4j
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> createInterview(@RequestBody Interview interview, @PathVariable("id") Long id) throws Exception {
        log.info("Interview controller, details received");
        Interview newInterview = this.interviewService.createInterview(interview, id);
        if (newInterview == null) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Interview cannot be created for candidate with id : " + id);
        }
        return ResponseEntity.ok().body(interview);
    }

    @GetMapping
    public List<InterviewDTO> getAllInterviews(){
        return this.interviewService.getAllInterviews();
    }

    @GetMapping("/my-interviews/pending")
    public List<InterviewerPageResponseDTO> getMyPendingInterviews() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return interviewService.findPendingInterviewsForInterviewer(email);
    }

    @GetMapping("/my-interviews/completed")
    public List<InterviewerPageResponseDTO> getMyCompletedInterviews() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return interviewService.findCompletedInterviewsForInterviewer(email);
    }

    @PutMapping("/{id}/set-interviewer")
    public Interview setInterviewer(@PathVariable Integer id,
                                    @RequestBody SetInterviewerRequest request) {
        return interviewService.setInterviewer(id, request);
    }
}
