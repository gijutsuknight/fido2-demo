import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useAuthStore } from '@/lib/store'

export default function SplashScreen() {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        router.replace('/(tabs)/dashboard')
      } else {
        router.replace('/login')
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [token])

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔑</Text>
      <Text style={styles.title}>FIDO2 Demo</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: { fontSize: 64 },
  title: { fontSize: 28, fontWeight: '700', color: '#ffffff' },
})
