import { Passkey, PasskeyError } from 'react-native-passkey'
import { config } from '@/config'
import api from './api'

function assertPasskeySupported() {
  if (!Passkey.isSupported()) {
    throw {
      error: 'NotSupported',
      message: 'Passkeys require iOS 15+ or Android 8+ on a physical device.',
    } satisfies PasskeyError
  }
}

export function getPasskeyErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const message = (err as { message: unknown }).message
    if (typeof message === 'string') return message
  }
  return fallback
}

export async function registerPasskey(username: string, displayName: string, email: string) {
  assertPasskeySupported()

  const { data: options } = await api.post('/register/options', { username, displayName, email })

  const result = await Passkey.create({
    challenge: options.challenge,
    rp: { ...options.rp, id: config.webauthn.rpId },
    user: options.user,
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation,
    authenticatorSelection: options.authenticatorSelection,
    excludeCredentials: options.excludeCredentials ?? [],
  })

  const { data: authData } = await api.post('/register/verify', {
    id: result.id,
    rawId: result.rawId,
    response: {
      clientDataJSON: result.response.clientDataJSON,
      attestationObject: result.response.attestationObject,
      transports: result.response.transports ?? [],
    },
    type: result.type,
  })

  return authData
}

export async function loginPasskey(username?: string) {
  assertPasskeySupported()

  const { data: options } = await api.post('/login/options', { username: username ?? '' })

  const result = await Passkey.get({
    challenge: options.challenge,
    rpId: config.webauthn.rpId,
    allowCredentials: [],
    userVerification: options.userVerification,
    timeout: options.timeout,
  })

  const { data: authData } = await api.post('/login/verify', {
    id: result.id,
    rawId: result.rawId,
    response: {
      clientDataJSON: result.response.clientDataJSON,
      authenticatorData: result.response.authenticatorData,
      signature: result.response.signature,
      userHandle: result.response.userHandle ?? null,
    },
    type: result.type,
  })

  return authData
}

export { PasskeyError }
