package com.fido2demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RegisterOptionsResponse {
    private String challenge;
    private RpInfo rp;
    private UserInfo user;
    private List<PubKeyCredParam> pubKeyCredParams;
    private Long timeout;
    private String attestation;
    private AuthenticatorSelection authenticatorSelection;
    private List<ExcludeCredential> excludeCredentials;

    @Data
    @Builder
    public static class RpInfo {
        private String id;
        private String name;
    }

    @Data
    @Builder
    public static class UserInfo {
        private String id;
        private String name;
        private String displayName;
    }

    @Data
    @Builder
    public static class PubKeyCredParam {
        private String type;
        private int alg;
    }

    @Data
    @Builder
    public static class AuthenticatorSelection {
        private String authenticatorAttachment;
        private String residentKey;
        private Boolean requireResidentKey;
        private String userVerification;
    }

    @Data
    @Builder
    public static class ExcludeCredential {
        private String type;
        private String id;
        private List<String> transports;
    }
}
