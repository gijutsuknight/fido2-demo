package com.fido2demo.repository;

import com.fido2demo.entity.Credential;
import com.fido2demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CredentialRepository extends JpaRepository<Credential, Long> {
    List<Credential> findByUser(User user);
    Optional<Credential> findByCredentialId(String credentialId);
    boolean existsByCredentialId(String credentialId);
}
