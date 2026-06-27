package com.fido2demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LoginOptionsResponse {
    private String challenge;
    private Long timeout;
    private String rpId;
    private List<AllowCredential> allowCredentials;
    private String userVerification;

    @Data
    @Builder
    public static class AllowCredential {
        private String type;
        private String id;
        private List<String> transports;
    }
}
