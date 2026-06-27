import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthState {
  token: string | null
  username: string | null
  displayName: string | null
  setAuth: (token: string, username: string, displayName: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      displayName: null,
      setAuth: (token, username, displayName) => set({ token, username, displayName }),
      logout: () => set({ token: null, username: null, displayName: null }),
    }),
    {
      name: 'fido2-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
