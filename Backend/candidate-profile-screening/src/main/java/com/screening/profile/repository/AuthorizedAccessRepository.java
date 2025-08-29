package com.screening.profile.repository;

import com.screening.profile.model.AuthorizedAccess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorizedAccessRepository extends JpaRepository<AuthorizedAccess, Long> {
    Optional<AuthorizedAccess> findByEmail(String email);
}
