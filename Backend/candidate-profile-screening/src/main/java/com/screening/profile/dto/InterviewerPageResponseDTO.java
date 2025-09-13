package com.screening.profile.dto;

import com.screening.profile.model.Feedback;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewerPageResponseDTO {
    private Integer interviewId;
    private String feedback;

    private CandidateInfo candidate;
    private JobApplicationInfo jobApplication;

    private Feedback round1Details;
    private Feedback round2Details;
    private Feedback round3Details;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CandidateInfo {
        private Long id;
        private String name;
        private String email;
        private String phoneNumber;
        private String dateOfBirth;
        private byte[] fileData;
        private Double score;
        private String summary;
        private String uniqueId;
        private java.util.List<String> matchedSkills;
        private String resumeText;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JobApplicationInfo {
        private Integer id;
        private String jobTitle;
        private String jobLocation;
    }
}
