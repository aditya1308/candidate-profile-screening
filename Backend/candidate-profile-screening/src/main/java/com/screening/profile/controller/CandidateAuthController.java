package com.screening.profile.controller;

import com.screening.profile.dto.CandidateLoginReqDTO;
import com.screening.profile.dto.CandidateRegisterReqDTO;
import com.screening.profile.exception.ErrorResponseModel;
import com.screening.profile.model.Candidate;
import com.screening.profile.repository.CandidateRepository;
import com.screening.profile.service.JwtService;
import com.screening.profile.util.enums.Status;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin("*")
@Slf4j
public class CandidateAuthController {

    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Rate limiting tracking: identifier/IP -> list of attempt timestamps (milliseconds)
    private final Map<String, List<Long>> loginAttempts = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 10;
    private static final long TIME_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

    public CandidateAuthController(CandidateRepository candidateRepository,
                                   PasswordEncoder passwordEncoder,
                                   JwtService jwtService) {
        this.candidateRepository = candidateRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private boolean isRateLimited(String clientKey) {
        long now = System.currentTimeMillis();
        List<Long> attempts = loginAttempts.computeIfAbsent(clientKey, k -> Collections.synchronizedList(new ArrayList<>()));
        synchronized (attempts) {
            attempts.removeIf(timestamp -> now - timestamp > TIME_WINDOW_MS);
            if (attempts.size() >= MAX_ATTEMPTS) {
                return true;
            }
            attempts.add(now);
            return false;
        }
    }

    @PostMapping(value = {"/api/candidate/login", "/api/v1/candidate/login"})
    public ResponseEntity<?> login(@Valid @RequestBody CandidateLoginReqDTO request,
                                   BindingResult bindingResult,
                                   HttpServletRequest servletRequest,
                                   @RequestParam(value = "format", required = false) String format,
                                   @RequestHeader(value = "Accept", required = false) String acceptHeader) {
        try {
            // Client IP / rate limit check
            String clientIp = servletRequest.getRemoteAddr();
            String identifier = request.getIdentifier();

            if (identifier == null || identifier.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponseModel("BAD_REQUEST", "Email or username is required"));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponseModel("BAD_REQUEST", "Password is required"));
            }

            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponseModel("BAD_REQUEST", errorMessage));
            }

            String rateLimitKey = clientIp + ":" + identifier.toLowerCase();
            if (isRateLimited(rateLimitKey)) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(new ErrorResponseModel("TOO_MANY_REQUESTS", "Too many login attempts. Please try again in 5 minutes."));
            }

            List<Candidate> candidates = candidateRepository.findByIdentifier(identifier);
            if (candidates == null || candidates.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseModel("UNAUTHORIZED", "Invalid email/username or password"));
            }

            Candidate matchedCandidate = null;
            for (Candidate c : candidates) {
                if (c.getPassword() != null && passwordEncoder.matches(request.getPassword(), c.getPassword())) {
                    matchedCandidate = c;
                    break;
                }
            }

            if (matchedCandidate == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseModel("UNAUTHORIZED", "Invalid email/username or password"));
            }

            // Successful authentication - clear rate limit attempts
            loginAttempts.remove(rateLimitKey);

            String candidateName = matchedCandidate.getName() != null ? matchedCandidate.getName() : matchedCandidate.getEmail();
            String token = jwtService.generateToken(matchedCandidate.getEmail(), "CANDIDATE", candidateName);

            // If client explicitly requested JSON (format=json or Accept: application/json without text/plain and */*)
            if ("json".equalsIgnoreCase(format) || (acceptHeader != null && acceptHeader.contains("application/json") && !acceptHeader.contains("*/*") && !acceptHeader.contains("text/plain"))) {
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("token", token);
                responseData.put("tokenType", "Bearer");
                responseData.put("email", matchedCandidate.getEmail());
                responseData.put("name", candidateName);
                responseData.put("id", matchedCandidate.getId());
                responseData.put("role", "CANDIDATE");
                return ResponseEntity.ok(responseData);
            }

            // Default follows existing codebase auth pattern in AdminController.signin
            return ResponseEntity.ok(token);

        } catch (Exception e) {
            log.error("Error during candidate login: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseModel("INTERNAL_SERVER_ERROR", "An unexpected error occurred during login. Please try again."));
        }
    }

    @PostMapping(value = {"/api/candidate/register", "/api/v1/candidate/register"})
    public ResponseEntity<?> register(@Valid @RequestBody CandidateRegisterReqDTO request,
                                      BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String error = bindingResult.getAllErrors().get(0).getDefaultMessage();
                return ResponseEntity.badRequest().body(new ErrorResponseModel("BAD_REQUEST", error));
            }

            List<Candidate> existingList = candidateRepository.findByIdentifier(request.getEmail().trim());
            if (existingList != null && !existingList.isEmpty()) {
                Candidate existing = existingList.get(0);
                if (existing.getPassword() != null && !existing.getPassword().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(new ErrorResponseModel("CONFLICT", "Account already exists with this email. Please log in."));
                }
                // Candidate applied earlier without password - update with newly chosen password
                existing.setPassword(passwordEncoder.encode(request.getPassword()));
                if (request.getName() != null && !request.getName().trim().isEmpty()) {
                    existing.setName(request.getName().trim());
                }
                if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
                    existing.setPhoneNumber(request.getPhoneNumber().trim());
                }
                candidateRepository.save(existing);
                return ResponseEntity.ok("Candidate registered successfully! Please log in.");
            }

            Candidate newCandidate = new Candidate();
            newCandidate.setEmail(request.getEmail().trim());
            newCandidate.setName(request.getName().trim());
            newCandidate.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : "0000000000");
            newCandidate.setPassword(passwordEncoder.encode(request.getPassword()));
            newCandidate.setStatus(Status.IN_PROCESS);
            newCandidate.setUniqueId(UUID.randomUUID().toString());

            candidateRepository.save(newCandidate);
            return ResponseEntity.ok("Candidate registered successfully! Please log in.");
        } catch (Exception e) {
            log.error("Error registering candidate: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseModel("INTERNAL_SERVER_ERROR", "Registration failed. Please try again."));
        }
    }

    @GetMapping(value = {"/api/candidate/me", "/api/v1/candidate/me"})
    public ResponseEntity<?> getCurrentCandidateProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseModel("UNAUTHORIZED", "Missing or invalid authorization token"));
            }
            String token = authHeader.substring(7);
            if (!jwtService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponseModel("UNAUTHORIZED", "Token is invalid or expired"));
            }

            String email = jwtService.extractEmail(token);
            List<Candidate> candidates = candidateRepository.findByIdentifier(email);
            if (candidates == null || candidates.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponseModel("NOT_FOUND", "Candidate profile not found"));
            }

            Candidate candidate = candidates.get(0);
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", candidate.getId());
            profile.put("name", candidate.getName());
            profile.put("email", candidate.getEmail());
            profile.put("phoneNumber", candidate.getPhoneNumber());
            profile.put("status", candidate.getStatus());
            profile.put("score", candidate.getScore());
            profile.put("summary", candidate.getSummary());
            profile.put("matchedSkills", candidate.getMatchedSkills());
            profile.put("role", "CANDIDATE");

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("Error fetching candidate profile: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseModel("INTERNAL_SERVER_ERROR", "Failed to retrieve candidate profile"));
        }
    }
}
