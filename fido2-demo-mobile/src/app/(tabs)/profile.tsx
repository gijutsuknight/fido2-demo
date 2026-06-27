import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'

interface UserProfile {
  username: string
  displayName: string
  email: string
  createdAt: string
}

export default function ProfileScreen() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const qc = useQueryClient()

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/me').then((r) => r.data),
  })

  const [form, setForm] = useState({ displayName: '', email: '' })

  const updateMutation = useMutation({
    mutationFn: () => api.put('/me', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      Alert.alert('Success', 'Profile updated!')
      setForm({ displayName: '', email: '' })
    },
    onError: (err: Error) => Alert.alert('Error', err.message),
  })

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout()
          router.replace('/login')
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Info</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Username</Text>
          <Text style={styles.rowValue}>{profile?.username ?? '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Email</Text>
          <Text style={styles.rowValue}>{profile?.email ?? '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Member since</Text>
          <Text style={styles.rowValue}>
            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Update Profile</Text>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          placeholder={profile?.displayName ?? 'Display name'}
          placeholderTextColor="#4b5563"
          value={form.displayName}
          onChangeText={(v) => setForm({ ...form, displayName: v })}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder={profile?.email ?? 'Email'}
          placeholderTextColor="#4b5563"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, updateMutation.isPending && styles.buttonDisabled]}
          onPress={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#030712', flex: 1 },
  container: { padding: 20, gap: 14 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#e5e7eb', marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: '#6b7280', fontSize: 13 },
  rowValue: { color: '#e5e7eb', fontSize: 13 },
  label: { fontSize: 13, color: '#9ca3af' },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    color: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#ffffff', fontWeight: '600' },
  logoutBtn: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)',
    borderWidth: 1,
    borderColor: '#7f1d1d',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#ef4444', fontWeight: '600' },
})
