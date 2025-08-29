package com.screening.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "interview")
@Convert(attributeName = "Feedback", converter = Feedback.class)
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "round1_details", columnDefinition = "json")
    private Feedback round1Details;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "round2_details", columnDefinition = "json")
    private Feedback round2Details;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "round3_details", columnDefinition = "json")
    private Feedback round3Details;

    @Column(name = "feedback_summary", length = 1000)
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_application_id", referencedColumnName = "id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_interview_job+application_id"))
    private JobApplication jobApplication;
}
