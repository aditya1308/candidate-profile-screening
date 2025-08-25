package com.screening.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_application")
@Getter
@Setter
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "job_id", nullable = false)
    private Integer jobId;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "application_date", nullable = false)
    private LocalDateTime applicationDate;

    @Column(nullable = false)
    private String status; // e.g., "Applied", "Under Review", "Accepted", "Rejected"

    public JobApplication() {}

    public JobApplication(Integer jobId, Long candidateId, String status) {
        this.jobId = jobId;
        this.candidateId = candidateId;
        this.applicationDate = LocalDateTime.now();
        this.status = status;
    }
}
