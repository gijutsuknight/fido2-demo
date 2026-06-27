package com.fido2demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class WellKnownController {

    @Value("${app.webauthn.android-package:com.fido2demo.mobile}")
    private String androidPackage;

    @Value("${app.webauthn.android-cert-fingerprints:}")
    private String androidCertFingerprints;

    @GetMapping(value = "/.well-known/assetlinks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Map<String, Object>> assetLinks() {
        List<String> fingerprints = Arrays.stream(androidCertFingerprints.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        Map<String, Object> target = new LinkedHashMap<>();
        target.put("namespace", "android_app");
        target.put("package_name", androidPackage);
        target.put("sha256_cert_fingerprints", fingerprints);

        Map<String, Object> statement = new LinkedHashMap<>();
        statement.put("relation", List.of("delegate_permission/common.handle_all_urls",
                "delegate_permission/common.get_login_creds"));
        statement.put("target", target);

        return List.of(statement);
    }
}
