const API_HOST = '192.168.1.11'
const API_PORT = 8080

export const config = {
  api: {
    host: API_HOST,
    port: API_PORT,
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? `http://${API_HOST}:${API_PORT}`,
  },
  webauthn: {
    rpId: process.env.EXPO_PUBLIC_RP_ID ?? API_HOST,
  },
} as const
