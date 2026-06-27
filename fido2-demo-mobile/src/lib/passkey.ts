import { Passkey, PasskeyError } from 'react-native-passkey'
import api from './api'

export async function registerPasskey(username: string, displayName: string, email: string) {
  const { data: options } = await api.post('/register/options', { username, displayName, email })

  const result = await Passkey.register({
    challenge: options.challenge,
    rp: options.rp,
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
  const { data: options } = await api.post('/login/options', { username: username ?? '' })

  const result = await Passkey.authenticate({
    challenge: options.challenge,
    rpId: options.rpId,
    allowCredentials: options.allowCredentials ?? [],
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
