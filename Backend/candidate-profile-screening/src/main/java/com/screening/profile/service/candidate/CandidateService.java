package com.screening.profile.service.candidate;

import com.screening.profile.model.Candidate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface CandidateService {
    Candidate extractAndSaveCandidateDetails(MultipartFile resume, String text) throws IOException;
    Optional<Candidate> findByUniqueId(String uniqueId);
    Candidate getOrCreateCandidate(String name, String email, String phone);
}
