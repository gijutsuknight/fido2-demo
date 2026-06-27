package com.fido2demo.repository;

import com.fido2demo.entity.LoginHistory;
import com.fido2demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    Page<LoginHistory> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
