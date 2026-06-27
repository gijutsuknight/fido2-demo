package com.fido2demo.controller;

import com.fido2demo.dto.request.LoginOptionsRequest;
import com.fido2demo.dto.request.LoginVerifyRequest;
import com.fido2demo.dto.response.AuthResponse;
import com.fido2demo.dto.response.LoginOptionsResponse;
import com.fido2demo.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/options")
    public ResponseEntity<LoginOptionsResponse> options(@RequestBody LoginOptionsRequest req) {
        return ResponseEntity.ok(authenticationService.startAuthentication(req));
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verify(@Valid @RequestBody LoginVerifyRequest req,
                                                HttpServletRequest httpReq) {
        return ResponseEntity.ok(authenticationService.finishAuthentication(req, httpReq));
    }
}
