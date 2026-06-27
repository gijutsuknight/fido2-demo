package com.fido2demo.service;

import com.fido2demo.dto.request.UpdateProfileRequest;
import com.fido2demo.dto.response.CredentialResponse;
import com.fido2demo.dto.response.LoginHistoryResponse;
import com.fido2demo.dto.response.UserResponse;
import com.fido2demo.entity.Credential;
import com.fido2demo.entity.User;
import com.fido2demo.repository.CredentialRepository;
import com.fido2demo.repository.LoginHistoryRepository;
import com.fido2demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final LoginHistoryRepository loginHistoryRepository;

    public UserResponse getProfile(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .credentialCount(credentialRepository.findByUser(user).size())
                .build();
    }

    @Transactional
    public UserResponse updateProfile(User user, UpdateProfileRequest req) {
        if (req.getDisplayName() != null && !req.getDisplayName().isBlank()) {
            user.setDisplayName(req.getDisplayName());
        }
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            if (!req.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(req.getEmail());
        }
        userRepository.save(user);
        return getProfile(user);
    }

    public List<CredentialResponse> getCredentials(User user) {
        return credentialRepository.findByUser(user).stream()
                .map(this::toCredentialResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCredential(User user, Long credentialId) {
        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Credential does not belong to user");
        }

        long remaining = credentialRepository.findByUser(user).stream()
                .filter(c -> !c.getId().equals(credentialId))
                .count();

        if (remaining == 0) {
            throw new IllegalStateException("Cannot delete last credential — account would be locked out");
        }

        credentialRepository.delete(credential);
    }

    public List<LoginHistoryResponse> getLoginHistory(User user, int page, int size) {
        Page<com.fido2demo.entity.LoginHistory> pageResult =
                loginHistoryRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page, size));
        return pageResult.getContent().stream()
                .map(h -> LoginHistoryResponse.builder()
                        .id(h.getId())
                        .device(h.getDevice())
                        .browser(h.getBrowser())
                        .ip(h.getIp())
                        .success(h.getSuccess())
                        .createdAt(h.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private CredentialResponse toCredentialResponse(Credential c) {
        List<String> transports = c.getTransports() != null
                ? Arrays.asList(c.getTransports().split(","))
                : List.of();
        return CredentialResponse.builder()
                .id(c.getId())
                .credentialId(c.getCredentialId())
                .aaguid(c.getAaguid())
                .transports(transports)
                .signCount(c.getSignCount())
                .createdAt(c.getCreatedAt())
                .lastUsed(c.getLastUsed())
                .build();
    }
}
