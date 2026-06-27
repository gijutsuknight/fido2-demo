package com.fido2demo.config;

import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.data.RelyingPartyIdentity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class WebAuthnConfig {

    @Value("${app.webauthn.rp-id}")
    private String rpId;

    @Value("${app.webauthn.rp-name}")
    private String rpName;

    @Value("${app.webauthn.rp-origins}")
    private String rpOrigins;

    @Bean
    public RelyingPartyIdentity relyingPartyIdentity() {
        return RelyingPartyIdentity.builder()
                .id(rpId)
                .name(rpName)
                .build();
    }

    @Bean
    public Set<String> allowedOrigins() {
        return Arrays.stream(rpOrigins.split(","))
                .map(String::trim)
                .collect(Collectors.toSet());
    }

    @Bean
    public String rpIdBean() {
        return rpId;
    }
}
