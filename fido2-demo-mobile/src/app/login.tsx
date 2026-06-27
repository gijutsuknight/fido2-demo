import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useAuthStore } from '@/lib/store'
import { loginPasskey, getPasskeyErrorMessage } from '@/lib/passkey'

export default function LoginScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    try {
      const data = await loginPasskey(username || undefined)
      setAuth(data.token, data.username, data.displayName)
      router.replace('/(tabs)/dashboard')
    } catch (err: unknown) {
      Alert.alert('Error', getPasskeyErrorMessage(err, 'Authentication failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔐</Text>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in with your passkey</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Username (optional)</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="alice"
          placeholderTextColor="#4b5563"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Authenticating…' : 'Sign in with Passkey'}
          </Text>
        </TouchableOpacity>
      </View>

      <Link href="/register" style={styles.link}>
        No account? Create one
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  form: { width: '100%', gap: 12 },
  label: { fontSize: 13, color: '#9ca3af', marginBottom: 2 },
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
  link: { color: '#818cf8', fontSize: 14, marginTop: 16 },
})
