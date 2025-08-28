package com.screening.profile.service.candidate;

import com.screening.profile.dto.CandidateReqDTO;
import com.screening.profile.model.Candidate;
import com.screening.profile.util.enums.Status;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CandidateService {
    Candidate extractAndSaveCandidateDetails(MultipartFile resume, String text, Long jobId, CandidateReqDTO candidateReqDTO) throws IOException;
    List<Candidate> getAllCandidates();
    Candidate getCandidateById(Long id);
    boolean saveCandidate(Candidate candidate);
    List<Candidate> getAllCandidatesByJobId(Long id);
    boolean updateCandidateStatus(Long id, Status status);
}
