package com.screening.profile.controller;

import com.screening.profile.model.Admin;
import com.screening.profile.model.AuthorizedAccess;
import com.screening.profile.repository.AdminRepository;
import com.screening.profile.repository.AuthorizedAccessRepository;
import com.screening.profile.service.JwtService;
import com.screening.profile.util.enums.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admins")
@CrossOrigin("*")
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthorizedAccessRepository authorizedAccessRepository;

    public AdminController(AdminRepository adminRepository, PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager, JwtService jwtService,
                           AuthorizedAccessRepository authorizedAccessRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.authorizedAccessRepository = authorizedAccessRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Admin admin) {
        if (admin.getRole() == Role.HR || admin.getRole() == Role.INTERVIEWER) {
            Optional<AuthorizedAccess> authorized = authorizedAccessRepository.findByEmail(admin.getEmail());
            if (authorized.isEmpty() || authorized.get().getRole() != admin.getRole()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("You are not authorized to signup. Contact SuperAdmin.");
            }
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepository.save(admin);
        return ResponseEntity.ok(admin.getRole() + " registered successfully!");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Admin admin) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(admin.getEmail(), admin.getPassword())
            );
            Admin adminDetails = adminRepository.findByEmail(admin.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));
            String token = jwtService.generateToken(authentication.getName(), adminDetails.getRole().name(), adminDetails.getFullName());
            return ResponseEntity.ok(token);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }

    @PostMapping("/onboard")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<String> onboardUser(@RequestBody AuthorizedAccess request) {
        if (authorizedAccessRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already onboarded.");
        }
        authorizedAccessRepository.save(request);
        return ResponseEntity.ok(request.getRole() + " onboarded with email: " + request.getEmail());
    }

    @GetMapping("/hrs")
    @PreAuthorize("hasAnyRole('SUPERADMIN','HR')")
    public ResponseEntity<List<Admin>> getAllHRs() {
        List<Admin> hrList = adminRepository.findByRole(Role.HR);
        return ResponseEntity.ok(hrList);
    }

    @GetMapping("/home")
    public String getAllAdmins() {
        return "Successfully logged in....";
    }

}
