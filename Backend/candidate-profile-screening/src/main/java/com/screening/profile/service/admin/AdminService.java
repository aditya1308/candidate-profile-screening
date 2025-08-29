package com.screening.profile.service.admin;

import com.screening.profile.model.Admin;
import com.screening.profile.repository.AdminRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService implements UserDetailsService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found. Please Signup"));
        return User.withUsername(admin.getUsername())
                .password(admin.getPassword())
                .roles("ADMIN")
                .build();
    }
}
