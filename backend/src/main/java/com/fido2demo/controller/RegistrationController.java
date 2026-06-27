package com.fido2demo.controller;

import com.fido2demo.dto.request.RegisterOptionsRequest;
import com.fido2demo.dto.request.RegisterVerifyRequest;
import com.fido2demo.dto.response.AuthResponse;
import com.fido2demo.dto.response.RegisterOptionsResponse;
import com.fido2demo.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/options")
    public ResponseEntity<RegisterOptionsResponse> options(@Valid @RequestBody RegisterOptionsRequest req) {
        return ResponseEntity.ok(registrationService.startRegistration(req));
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verify(@Valid @RequestBody RegisterVerifyRequest req) {
        return ResponseEntity.ok(registrationService.finishRegistration(req));
    }
}
