package com.screening.profile.service.admin;

import com.screening.profile.model.Admin;
import com.screening.profile.model.Candidate;
import com.screening.profile.repository.AdminRepository;
import com.screening.profile.repository.CandidateRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final CandidateRepository candidateRepository;

    public AdminService(AdminRepository adminRepository, CandidateRepository candidateRepository) {
        this.adminRepository = adminRepository;
        this.candidateRepository = candidateRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return User.withUsername(admin.get().getEmail())
                    .password(admin.get().getPassword())
                    .roles(admin.get().getRole().name())
                    .build();
        }

        List<Candidate> candidates = candidateRepository.findByIdentifier(email);
        if (candidates != null && !candidates.isEmpty()) {
            Candidate candidate = candidates.get(0);
            return User.withUsername(candidate.getEmail())
                    .password(candidate.getPassword() != null ? candidate.getPassword() : "")
                    .roles("CANDIDATE")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with identifier: " + email);
    }
}
