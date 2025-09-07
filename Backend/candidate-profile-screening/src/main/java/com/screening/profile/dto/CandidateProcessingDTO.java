package com.screening.profile.dto;

import com.screening.profile.model.Candidate;
import lombok.Data;

import java.util.List;

@Data
public class CandidateProcessingDTO {
    List<Candidate> processedCandidates;
    List<String> unProcessedCandidates;
}
