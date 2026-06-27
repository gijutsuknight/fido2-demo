package com.fido2demo.webauthn;

import com.fido2demo.entity.User;
import com.fido2demo.repository.UserRepository;
import com.yubico.webauthn.CredentialRepository;
import com.yubico.webauthn.RegisteredCredential;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.PublicKeyCredentialDescriptor;
import com.yubico.webauthn.data.PublicKeyCredentialType;
import com.yubico.webauthn.data.exception.Base64UrlException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class DatabaseCredentialRepository implements CredentialRepository {

    private final UserRepository userRepository;
    private final com.fido2demo.repository.CredentialRepository credentialRepository;

    @Override
    public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> credentialRepository.findByUser(user).stream()
                        .map(c -> {
                            try {
                                return PublicKeyCredentialDescriptor.builder()
                                        .id(ByteArray.fromBase64Url(c.getCredentialId()))
                                        .type(PublicKeyCredentialType.PUBLIC_KEY)
                                        .build();
                            } catch (Base64UrlException e) {
                                return null;
                            }
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet()))
                .orElse(Collections.emptySet());
    }

    @Override
    public Optional<ByteArray> getUserHandleForUsername(String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    try {
                        return ByteArray.fromBase64Url(encodeUserId(user.getId()));
                    } catch (Base64UrlException e) {
                        return null;
                    }
                });
    }

    @Override
    public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
        try {
            long userId = decodeUserId(userHandle.getBase64Url());
            return userRepository.findById(userId).map(User::getUsername);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
        String credId = credentialId.getBase64Url();
        return credentialRepository.findByCredentialId(credId)
                .map(c -> {
                    try {
                        return RegisteredCredential.builder()
                                .credentialId(credentialId)
                                .userHandle(userHandle)
                                .publicKeyCose(ByteArray.fromBase64Url(c.getPublicKey()))
                                .signatureCount(c.getSignCount())
                                .build();
                    } catch (Base64UrlException e) {
                        return null;
                    }
                });
    }

    @Override
    public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
        String credId = credentialId.getBase64Url();
        return credentialRepository.findByCredentialId(credId)
                .map(c -> {
                    try {
                        ByteArray userHandle = ByteArray.fromBase64Url(encodeUserId(c.getUser().getId()));
                        return RegisteredCredential.builder()
                                .credentialId(credentialId)
                                .userHandle(userHandle)
                                .publicKeyCose(ByteArray.fromBase64Url(c.getPublicKey()))
                                .signatureCount(c.getSignCount())
                                .build();
                    } catch (Base64UrlException e) {
                        return null;
                    }
                })
                .map(Set::of)
                .orElse(Collections.emptySet());
    }

    private String encodeUserId(Long id) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(longToBytes(id));
    }

    private long decodeUserId(String base64url) {
        byte[] bytes = Base64.getUrlDecoder().decode(base64url);
        return bytesToLong(bytes);
    }

    private byte[] longToBytes(long value) {
        byte[] result = new byte[8];
        for (int i = 7; i >= 0; i--) {
            result[i] = (byte) (value & 0xFF);
            value >>= 8;
        }
        return result;
    }

    private long bytesToLong(byte[] bytes) {
        long result = 0;
        for (byte b : bytes) {
            result = (result << 8) | (b & 0xFF);
        }
        return result;
    }
}
