package com.screening.profile.service;


import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendInterviewMail(String to, String subject, String body)
    {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("bharatkorlahalli12@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, body.trim().startsWith("<"));

            mailSender.send(message);
        } catch (MessagingException exception) {
            throw new IllegalStateException("Unable to create interview email", exception);
        }
    }
}
