package com.screening.profile.dto;

import com.screening.profile.model.Feedback;
import lombok.Data;

@Data
public class InterviewDTO {
    private Integer id;
    private Feedback round1Details;
    private Feedback round2Details;
    private Feedback round3Details;
    private String feedback;
    private Integer jobApplicationId;
    private Integer candidateId;
    private Integer jobId;
}