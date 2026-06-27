package com.fido2demo.controller;

import com.fido2demo.dto.request.UpdateProfileRequest;
import com.fido2demo.dto.response.CredentialResponse;
import com.fido2demo.dto.response.LoginHistoryResponse;
import com.fido2demo.dto.response.UserResponse;
import com.fido2demo.entity.User;
import com.fido2demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }

    @PutMapping("/api/me")
    public ResponseEntity<UserResponse> updateMe(@AuthenticationPrincipal User user,
                                                  @Valid @RequestBody UpdateProfileRequest req) {
        return ResponseEntity.ok(userService.updateProfile(user, req));
    }

    @GetMapping("/api/credentials")
    public ResponseEntity<List<CredentialResponse>> getCredentials(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getCredentials(user));
    }

    @DeleteMapping("/api/credentials/{id}")
    public ResponseEntity<Void> deleteCredential(@AuthenticationPrincipal User user,
                                                  @PathVariable Long id) {
        userService.deleteCredential(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/login-history")
    public ResponseEntity<List<LoginHistoryResponse>> getLoginHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.getLoginHistory(user, page, size));
    }

    @GetMapping("/api/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
