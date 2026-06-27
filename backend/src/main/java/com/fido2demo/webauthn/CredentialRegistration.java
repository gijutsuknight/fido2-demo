package com.fido2demo.webauthn;

import com.yubico.webauthn.RegisteredCredential;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.UserIdentity;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CredentialRegistration {
    UserIdentity userIdentity;
    RegisteredCredential credential;
}
