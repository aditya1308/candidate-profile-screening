package com.screening.profile.controller;

import com.screening.profile.dto.EmailRequestDTO;
import com.screening.profile.dto.SelectionRejectionRequestDTO;
import com.screening.profile.service.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/email")
@CrossOrigin("*")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/schedule-invite")
    public String sendInterviewInvite(@RequestBody EmailRequestDTO request) {
        emailService.sendInterviewMail(request.getCandidateEmail(), request.getSubject(), request.getBody());
        return "Interview email sent successfully!";
    }

    @PostMapping("/send-rejection")
    public String sendRejectionMail(@RequestBody SelectionRejectionRequestDTO request) {
        String body = "Dear " + request.getCandidateName() + ",\n\n" +
                "Thank you for applying at Societe Generale.\n" +
                "After careful consideration, we regret to inform you that you have not been selected for the position.\n\n" +
                "We appreciate your interest and encourage you to apply for future opportunities.\n\n" +
                "Best regards,\nHR Team";

        emailService.sendInterviewMail(request.getCandidateEmail(), "Thank you for your interest", body);
        return "Rejection email sent successfully!";
    }

    @PostMapping("/send-selection")
    public String sendSelectionMail(@RequestBody SelectionRejectionRequestDTO request) {
        String body = "Dear " + request.getCandidateName() + ",\n\n" +
                "Congratulations! 🎉\n\n" +
                "We are pleased to inform you that you have been selected for the position at our company.\n" +
                "Our HR team will be in touch with you shortly to discuss the next steps in the hiring process.\n\n" +
                "We look forward to working with you!\n\n" +
                "Best regards,\nHR Team";

        emailService.sendInterviewMail(request.getCandidateEmail(), "Congratulations! You're Selected", body);
        return "Selection email sent successfully!";
    }

}

