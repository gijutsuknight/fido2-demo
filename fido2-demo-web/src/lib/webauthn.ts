import api from './api'

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const padded = base64url.replace(/-/g, '+').replace(/_/g, '/') +
    '=='.slice(0, (4 - base64url.length % 4) % 4)
  const binary = atob(padded)
  const buffer = new ArrayBuffer(binary.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i)
  return buffer
}

export async function registerPasskey(username: string, displayName: string, email: string) {
  const { data: options } = await api.post('/register/options', { username, displayName, email })

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64urlToBuffer(options.challenge),
      rp: options.rp,
      user: {
        id: base64urlToBuffer(options.user.id),
        name: options.user.name,
        displayName: options.user.displayName,
      },
      pubKeyCredParams: options.pubKeyCredParams,
      timeout: options.timeout,
      attestation: options.attestation,
      authenticatorSelection: options.authenticatorSelection,
      excludeCredentials: (options.excludeCredentials || []).map((c: { id: string; type: string; transports?: string[] }) => ({
        ...c,
        id: base64urlToBuffer(c.id),
      })),
    },
  }) as PublicKeyCredential

  const response = credential.response as AuthenticatorAttestationResponse

  const { data: authData } = await api.post('/register/verify', {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
      transports: response.getTransports?.() ?? [],
    },
    type: credential.type,
  })

  return authData
}

export async function loginPasskey(username?: string) {
  const { data: options } = await api.post('/login/options', { username: username ?? '' })

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: base64urlToBuffer(options.challenge),
      timeout: options.timeout,
      rpId: options.rpId,
      allowCredentials: (options.allowCredentials || []).map((c: { id: string; type: string; transports?: string[] }) => ({
        ...c,
        id: base64urlToBuffer(c.id),
      })),
      userVerification: options.userVerification,
    },
  }) as PublicKeyCredential

  const response = assertion.response as AuthenticatorAssertionResponse

  const { data: authData } = await api.post('/login/verify', {
    id: assertion.id,
    rawId: bufferToBase64url(assertion.rawId),
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      authenticatorData: bufferToBase64url(response.authenticatorData),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
    },
    type: assertion.type,
  })

  return authData
}
