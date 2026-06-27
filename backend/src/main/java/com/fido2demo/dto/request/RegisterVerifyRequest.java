package com.fido2demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RegisterVerifyRequest {

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
        private String attestationObject;
        private List<String> transports;
    }
}
