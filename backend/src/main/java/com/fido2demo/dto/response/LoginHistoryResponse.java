package com.fido2demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LoginHistoryResponse {
    private Long id;
    private String device;
    private String browser;
    private String ip;
    private Boolean success;
    private LocalDateTime createdAt;
}
