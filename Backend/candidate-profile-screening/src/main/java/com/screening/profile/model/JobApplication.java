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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false, foreignKey = @ForeignKey(name = "fk_job_application_job"))
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false, foreignKey = @ForeignKey(name = "fk_job_application_candidate"))
    private Candidate candidate;

    @Column(name = "application_date", nullable = false)
    private LocalDateTime applicationDate;

    @Column(nullable = false)
    private String status; // Status of the application, e.g., "Applied", "Under Review", "Accepted", "Rejected"

    public JobApplication() {}

    public JobApplication(Job job, Candidate candidate, String status) {
        this.job = job;
        this.candidate = candidate;
        this.applicationDate = LocalDateTime.now();
        this.status = status;
    }
}
