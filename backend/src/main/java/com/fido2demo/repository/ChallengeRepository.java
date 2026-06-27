package com.fido2demo.repository;

import com.fido2demo.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    Optional<Challenge> findByChallengeAndType(String challenge, Challenge.Type type);

    @Modifying
    @Query("DELETE FROM Challenge c WHERE c.expiresAt < :now")
    void deleteExpired(LocalDateTime now);
}
