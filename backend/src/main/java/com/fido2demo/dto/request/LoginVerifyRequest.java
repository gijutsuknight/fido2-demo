package com.fido2demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginVerifyRequest {

    @NotBlank
    private String id;

    @NotBlank
    private String rawId;

    @NotNull
    private Response response;

    private String type;

    @Data
    public static class Response {
        private String clientDataJSON;
        private String authenticatorData;
        private String signature;
        private String userHandle;
    }
}
