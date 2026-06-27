import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface Credential {
  id: number
  credentialId: string
  transports: string[]
  signCount: number
  createdAt: string
  lastUsed: string | null
}

export default function CredentialsScreen() {
  const qc = useQueryClient()

  const { data: credentials, isLoading } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: () => api.get('/credentials').then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/credentials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credentials'] }),
    onError: (err: Error) => Alert.alert('Error', err.message),
  })

  function confirmDelete(id: number) {
    Alert.alert('Delete Passkey', 'Are you sure? You cannot undo this.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ])
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Your Passkeys</Text>

      {isLoading && <Text style={styles.empty}>Loading…</Text>}
      {credentials?.length === 0 && <Text style={styles.empty}>No passkeys registered.</Text>}

      {credentials?.map((c) => (
        <View key={c.id} style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.credId} numberOfLines={1}>
              {c.credentialId.slice(0, 20)}…
            </Text>
            {c.transports.length > 0 && (
              <View style={styles.transports}>
                {c.transports.map((t) => (
                  <View key={t} style={styles.transport}>
                    <Text style={styles.transportText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.meta}>
              Count: {c.signCount} · {new Date(c.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(c.id)}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#030712', flex: 1 },
  container: { padding: 20, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  empty: { color: '#4b5563', fontSize: 14 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardLeft: { flex: 1, gap: 4 },
  credId: { color: '#e5e7eb', fontFamily: 'monospace', fontSize: 13 },
  transports: { flexDirection: 'row', gap: 6 },
  transport: { backgroundColor: '#1f2937', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  transportText: { color: '#9ca3af', fontSize: 10 },
  meta: { color: '#6b7280', fontSize: 11 },
  deleteBtn: {
    borderWidth: 1,
    borderColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteBtnText: { color: '#ef4444', fontSize: 13 },
})
