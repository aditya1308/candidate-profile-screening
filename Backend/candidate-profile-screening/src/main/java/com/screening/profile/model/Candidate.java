package com.screening.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
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

    @ElementCollection
    @CollectionTable(name = "candidate_matched_skills", joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "skill")
    private List<String> matchedSkills = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<JobApplication> applications = new ArrayList<>();
}
