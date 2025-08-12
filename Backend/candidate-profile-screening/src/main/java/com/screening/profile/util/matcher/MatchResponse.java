package com.screening.profile.util.matcher;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MatchResponse {
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private int score;
    private String summary;
}
