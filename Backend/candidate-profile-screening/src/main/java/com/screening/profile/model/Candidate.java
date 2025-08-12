package com.screening.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "candidate")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;
    private Integer score;
    @Column(name = "summary", length = 1000)
    private String summary;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData;
    private String uniqueId;
    // one to many mapping of candidate to job applicatipn
}
