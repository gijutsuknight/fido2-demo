import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'

interface LoginHistory {
  id: number
  device: string
  browser: string
  ip: string
  success: boolean
  createdAt: string
}

interface UserProfile {
  credentialCount: number
}

export default function DashboardScreen() {
  const { displayName } = useAuthStore()

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/me').then((r) => r.data),
  })

  const { data: history } = useQuery<LoginHistory[]>({
    queryKey: ['login-history'],
    queryFn: () => api.get('/login-history?size=10').then((r) => r.data),
  })

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hello, {displayName} 👋</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: '#818cf8' }]}>{profile?.credentialCount ?? '—'}</Text>
          <Text style={styles.statLabel}>Passkeys</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: '#4ade80' }]}>
            {history?.filter((h) => h.success).length ?? '—'}
          </Text>
          <Text style={styles.statLabel}>Recent logins</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Login History</Text>
      {history?.map((h) => (
        <View key={h.id} style={styles.historyItem}>
          <View style={styles.historyLeft}>
            <Text style={styles.historyBrowser}>{h.browser} · {h.device}</Text>
            <Text style={styles.historyIp}>{h.ip}</Text>
          </View>
          <View style={[styles.badge, h.success ? styles.badgeSuccess : styles.badgeFail]}>
            <Text style={[styles.badgeText, { color: h.success ? '#4ade80' : '#f87171' }]}>
              {h.success ? 'OK' : 'Failed'}
            </Text>
          </View>
        </View>
      ))}
      {history?.length === 0 && (
        <Text style={styles.empty}>No login history yet.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#030712', flex: 1 },
  container: { padding: 20, gap: 12 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  stats: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  stat: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statNum: { fontSize: 32, fontWeight: '700' },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#9ca3af', marginTop: 8 },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  historyLeft: { gap: 2 },
  historyBrowser: { color: '#e5e7eb', fontSize: 13 },
  historyIp: { color: '#6b7280', fontSize: 11 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeSuccess: { backgroundColor: 'rgba(74, 222, 128, 0.1)' },
  badgeFail: { backgroundColor: 'rgba(248, 113, 113, 0.1)' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  empty: { color: '#4b5563', fontSize: 14 },
})
