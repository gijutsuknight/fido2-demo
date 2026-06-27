package com.fido2demo.service;

import com.fido2demo.dto.request.RegisterOptionsRequest;
import com.fido2demo.dto.request.RegisterVerifyRequest;
import com.fido2demo.dto.response.AuthResponse;
import com.fido2demo.dto.response.RegisterOptionsResponse;
import com.fido2demo.entity.Challenge;
import com.fido2demo.entity.Credential;
import com.fido2demo.entity.User;
import com.fido2demo.repository.CredentialRepository;
import com.fido2demo.repository.UserRepository;
import com.fido2demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final ChallengeService challengeService;
    private final JwtUtil jwtUtil;

    @Value("${app.webauthn.rp-id}")
    private String rpId;

    @Value("${app.webauthn.rp-name}")
    private String rpName;

    @Transactional
    public RegisterOptionsResponse startRegistration(RegisterOptionsRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create user eagerly; if verify never comes the account has no credentials
        User user = new User(req.getUsername(), req.getDisplayName(), req.getEmail());
        userRepository.save(user);

        String challenge = challengeService.createChallenge(req.getUsername(), Challenge.Type.REGISTRATION);

        byte[] userIdBytes = new byte[8];
        longToBytes(user.getId(), userIdBytes);
        String userIdBase64 = Base64.getUrlEncoder().withoutPadding().encodeToString(userIdBytes);

        return RegisterOptionsResponse.builder()
                .challenge(challenge)
                .rp(RegisterOptionsResponse.RpInfo.builder()
                        .id(rpId)
                        .name(rpName)
                        .build())
                .user(RegisterOptionsResponse.UserInfo.builder()
                        .id(userIdBase64)
                        .name(req.getUsername())
                        .displayName(req.getDisplayName())
                        .build())
                .pubKeyCredParams(List.of(
                        RegisterOptionsResponse.PubKeyCredParam.builder().type("public-key").alg(-7).build(),
                        RegisterOptionsResponse.PubKeyCredParam.builder().type("public-key").alg(-257).build()
                ))
                .timeout(60000L)
                .attestation("none")
                .authenticatorSelection(RegisterOptionsResponse.AuthenticatorSelection.builder()
                        .residentKey("preferred")
                        .requireResidentKey(false)
                        .userVerification("preferred")
                        .build())
                .excludeCredentials(List.of())
                .build();
    }

    @Transactional
    public AuthResponse finishRegistration(RegisterVerifyRequest req) {
        String clientDataJson = new String(
                Base64.getUrlDecoder().decode(padBase64(req.getResponse().getClientDataJSON())));
        String challenge = extractChallengeFromClientData(clientDataJson);

        Challenge stored = challengeService.consumeChallenge(challenge, Challenge.Type.REGISTRATION);
        String username = stored.getUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found; restart registration"));

        Credential credential = new Credential();
        credential.setUser(user);
        credential.setCredentialId(req.getRawId());
        // Store attestationObject as the public key blob for now; a full impl would parse COSE
        credential.setPublicKey(req.getResponse().getAttestationObject());
        credential.setSignCount(0L);

        if (req.getResponse().getTransports() != null && !req.getResponse().getTransports().isEmpty()) {
            credential.setTransports(String.join(",", req.getResponse().getTransports()));
        }

        credentialRepository.save(credential);

        return AuthResponse.builder()
                .token(jwtUtil.generateToken(username))
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .build();
    }

    private String extractChallengeFromClientData(String json) {
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

    private void longToBytes(long value, byte[] result) {
        for (int i = 7; i >= 0; i--) {
            result[i] = (byte) (value & 0xFF);
            value >>= 8;
        }
    }
}
