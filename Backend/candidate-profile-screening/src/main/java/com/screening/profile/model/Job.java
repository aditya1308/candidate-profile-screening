package com.screening.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @JsonIgnore
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<JobApplication> applications = new ArrayList<>();

    public Job() {}

    public Job(Integer id, String title, String description, String location) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
    }
}
