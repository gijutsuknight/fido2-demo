package com.fido2demo.service;

import com.fido2demo.entity.Challenge;
import com.fido2demo.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.webauthn.challenge-timeout:300000}")
    private long challengeTimeout;

    @Transactional
    public String createChallenge(String username, Challenge.Type type) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String challenge = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        LocalDateTime expiresAt = LocalDateTime.now().plusNanos(challengeTimeout * 1_000_000L);
        challengeRepository.save(new Challenge(challenge, username, type, expiresAt));
        return challenge;
    }

    @Transactional
    public Challenge consumeChallenge(String challenge, Challenge.Type type) {
        Challenge stored = challengeRepository
                .findByChallengeAndType(challenge, type)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired challenge"));

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            challengeRepository.delete(stored);
            throw new IllegalArgumentException("Challenge has expired");
        }

        challengeRepository.delete(stored);
        return stored;
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void cleanupExpiredChallenges() {
        challengeRepository.deleteExpired(LocalDateTime.now());
    }
}
