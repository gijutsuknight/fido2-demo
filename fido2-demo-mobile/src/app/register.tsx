import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useRouter, Link } from 'expo-router'
import { useAuthStore } from '@/lib/store'
import { registerPasskey } from '@/lib/passkey'

export default function RegisterScreen() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ username: '', displayName: '', email: '' })
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!form.username || !form.displayName || !form.email) {
      Alert.alert('Error', 'All fields are required')
      return
    }
    setLoading(true)
    try {
      const data = await registerPasskey(form.username, form.displayName, form.email)
      setAuth(data.token, data.username, data.displayName)
      router.replace('/(tabs)/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      Alert.alert('Error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.icon}>🔑</Text>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Register with a passkey — no password needed</Text>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(v) => setForm({ ...form, username: v })}
            placeholder="alice"
            placeholderTextColor="#4b5563"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={form.displayName}
            onChangeText={(v) => setForm({ ...form, displayName: v })}
            placeholder="Alice Smith"
            placeholderTextColor="#4b5563"
          />
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
            placeholder="alice@example.com"
            placeholderTextColor="#4b5563"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating passkey…' : 'Register with Passkey'}
          </Text>
        </TouchableOpacity>
      </View>

      <Link href="/login" style={styles.link}>
        Already have an account? Sign in
      </Link>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#030712', flex: 1 },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    minHeight: '100%',
  },
  icon: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16, textAlign: 'center' },
  form: { width: '100%', gap: 14 },
  label: { fontSize: 13, color: '#9ca3af', marginBottom: 4 },
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
