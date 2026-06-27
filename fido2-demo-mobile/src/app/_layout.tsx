import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store'

const qc = new QueryClient()

function AuthGuard() {
  const token = useAuthStore((s) => s.token)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)'
    if (!token && inAuthGroup) {
      router.replace('/login')
    } else if (token && !inAuthGroup && segments[0] !== undefined) {
      // Allow staying on login/register for now
    }
  }, [token, segments])

  return null
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Sign In', headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Create Account', headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
