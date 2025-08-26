package com.screening.profile.service.candidate;

import com.screening.profile.model.Candidate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CandidateService {
    Candidate extractAndSaveCandidateDetails(MultipartFile resume, String text, Long jobId) throws IOException;
    List<Candidate> getAllCandidates();
    Candidate getCandidateById(Long id);
    boolean saveCandidate(Candidate candidate);
}
