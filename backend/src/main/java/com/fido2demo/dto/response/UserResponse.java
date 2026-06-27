package com.fido2demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String displayName;
    private String email;
    private LocalDateTime createdAt;
    private int credentialCount;
}
