package com.screening.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateInterviewDTO {

    private Long id;
    private String dateOfBirth;
    private String email;
    private byte[] fileData;
    private List<String> matchedSkills;
    private String name;
    private String phoneNumber;
    private Integer score;
    private String status;
    private String summary;
    private String uniqueId;

    // Interview feedback fields
    private String feedbackSummary;
    private String round1Feedback;
    private String round2Feedback;
    private String round3Feedback;
}
