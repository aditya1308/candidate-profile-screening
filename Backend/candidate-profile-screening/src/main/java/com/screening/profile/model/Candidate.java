package com.screening.profile.model;

import com.screening.profile.util.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "candidate")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @NotNull
    @Email(message = "Email is not valid")
    private String email;

    @NotNull
    @Pattern(regexp = "(^$|[0-9]{10})", message = "Mobile number is not valid")
    private String phoneNumber;
    private String dateOfBirth;
    private Double score;
    @Column(name = "summary", length = 1000)
    private String summary;
    @Column(name = "file_data", columnDefinition = "BYTEA")
    private byte[] fileData;

    private String uniqueId;

    @Column(columnDefinition = "TEXT")
    private List<String> matchedSkills;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @Override
    public String toString() {
        return "Candidate{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                ", score=" + score +
                ", summary='" + summary + '\'' +
                ", uniqueId='" + uniqueId + '\'' +
                ", matchedSkills=" + matchedSkills +
                '}';
    }
    // one to many mapping of candidate to job applicatipn
}
