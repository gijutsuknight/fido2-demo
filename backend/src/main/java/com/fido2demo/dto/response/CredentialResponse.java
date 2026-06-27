package com.fido2demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CredentialResponse {
    private Long id;
    private String credentialId;
    private String aaguid;
    private List<String> transports;
    private long signCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsed;
}
