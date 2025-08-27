package com.screening.profile.dto;

import com.screening.profile.model.Candidate;
import com.screening.profile.model.Job;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobApplicationDTO {
    private Integer id;
    private Job job;
    private Candidate candidate;
    private LocalDateTime applicationDate;
}
