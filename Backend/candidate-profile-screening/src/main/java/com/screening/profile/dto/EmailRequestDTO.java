package com.screening.profile.dto;

import lombok.Data;

@Data
public class EmailRequestDTO {
    private String candidateName;
    private String candidateEmail;
    private String interviewerName;
    private String interviewerEmail;
    private String subject;
    private String body;
    private String meetLink;

}
