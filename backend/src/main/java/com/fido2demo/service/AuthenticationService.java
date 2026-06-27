package com.fido2demo.service;

import com.fido2demo.dto.request.LoginOptionsRequest;
import com.fido2demo.dto.request.LoginVerifyRequest;
import com.fido2demo.dto.response.AuthResponse;
import com.fido2demo.dto.response.LoginOptionsResponse;
import com.fido2demo.entity.Challenge;
import com.fido2demo.entity.Credential;
import com.fido2demo.entity.LoginHistory;
import com.fido2demo.entity.User;
import com.fido2demo.repository.CredentialRepository;
import com.fido2demo.repository.LoginHistoryRepository;
import com.fido2demo.repository.UserRepository;
import com.fido2demo.security.JwtUtil;
import com.fido2demo.util.UserAgentParser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final ChallengeService challengeService;
    private final JwtUtil jwtUtil;
    private final UserAgentParser userAgentParser;

    @Value("${app.webauthn.rp-id}")
    private String rpId;

    @Transactional
    public LoginOptionsResponse startAuthentication(LoginOptionsRequest req) {
        String challenge = challengeService.createChallenge(req.getUsername(), Challenge.Type.AUTHENTICATION);

        List<LoginOptionsResponse.AllowCredential> allowCredentials = List.of();

        if (req.getUsername() != null && !req.getUsername().isBlank()) {
            allowCredentials = userRepository.findByUsername(req.getUsername())
                    .map(user -> credentialRepository.findByUser(user).stream()
                            .map(c -> LoginOptionsResponse.AllowCredential.builder()
                                    .type("public-key")
                                    .id(c.getCredentialId())
                                    .transports(c.getTransports() != null
                                            ? List.of(c.getTransports().split(","))
                                            : List.of())
                                    .build())
                            .collect(Collectors.toList()))
                    .orElse(List.of());
        }

        return LoginOptionsResponse.builder()
                .challenge(challenge)
                .timeout(60000L)
                .rpId(rpId)
                .allowCredentials(allowCredentials)
                .userVerification("preferred")
                .build();
    }

    @Transactional
    public AuthResponse finishAuthentication(LoginVerifyRequest req, HttpServletRequest httpReq) {
        String clientDataJson = new String(
                Base64.getUrlDecoder().decode(padBase64(req.getResponse().getClientDataJSON())));
        String challenge = extractChallenge(clientDataJson);

        challengeService.consumeChallenge(challenge, Challenge.Type.AUTHENTICATION);

        Credential credential = credentialRepository.findByCredentialId(req.getRawId())
                .orElseThrow(() -> new IllegalArgumentException("Unknown credential"));

        // Update sign count and last used
        credential.setSignCount(credential.getSignCount() + 1);
        credential.setLastUsed(LocalDateTime.now());
        credentialRepository.save(credential);

        User user = credential.getUser();
        recordLoginHistory(user, httpReq, true);

        return AuthResponse.builder()
                .token(jwtUtil.generateToken(user.getUsername()))
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .build();
    }

    private void recordLoginHistory(User user, HttpServletRequest req, boolean success) {
        String ua = req.getHeader("User-Agent");
        LoginHistory history = new LoginHistory();
        history.setUser(user);
        history.setDevice(userAgentParser.parseDevice(ua));
        history.setBrowser(userAgentParser.parseBrowser(ua));
        history.setIp(getClientIp(req));
        history.setSuccess(success);
        loginHistoryRepository.save(history);
    }

    private String getClientIp(HttpServletRequest req) {
        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

    private String extractChallenge(String json) {
        int start = json.indexOf("\"challenge\":\"");
        if (start < 0) throw new IllegalArgumentException("No challenge in clientDataJSON");
        start += 13;
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }

    private String padBase64(String base64url) {
        int pad = (4 - base64url.length() % 4) % 4;
        return base64url + "=".repeat(pad);
    }
}
