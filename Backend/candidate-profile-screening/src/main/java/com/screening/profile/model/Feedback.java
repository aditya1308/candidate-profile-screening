package com.screening.profile.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Feedback {

    private String interviewerName;
    private String feedback;
    private String status;
}
