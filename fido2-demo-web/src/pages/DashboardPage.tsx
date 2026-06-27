import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../lib/store'

interface LoginHistory {
  id: number
  device: string
  browser: string
  ip: string
  success: boolean
  createdAt: string
}

interface UserProfile {
  username: string
  displayName: string
  email: string
  credentialCount: number
  createdAt: string
}

export default function DashboardPage() {
  const { displayName } = useAuthStore()

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/me').then((r) => r.data),
  })

  const { data: history } = useQuery<LoginHistory[]>({
    queryKey: ['login-history'],
    queryFn: () => api.get('/login-history?size=5').then((r) => r.data),
  })

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hello, {displayName} 👋
            </h1>
            <p className="text-gray-400 text-sm">{profile?.email}</p>
          </div>
          <nav className="flex gap-3">
            <Link to="/credentials" className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-800 px-3 py-1.5 rounded-lg">
              Credentials
            </Link>
            <Link to="/profile" className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-800 px-3 py-1.5 rounded-lg">
              Profile
            </Link>
            <Link to="/protocol" className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-800 px-3 py-1.5 rounded-lg">
              Protocol Viewer
            </Link>
          </nav>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-3xl font-bold text-indigo-400">{profile?.credentialCount ?? '—'}</div>
            <div className="text-gray-400 text-sm mt-1">Passkeys registered</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-3xl font-bold text-green-400">{history?.filter((h) => h.success).length ?? '—'}</div>
            <div className="text-gray-400 text-sm mt-1">Successful logins (recent)</div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-white font-semibold">Recent Login History</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {history?.length === 0 && (
              <div className="px-5 py-4 text-gray-500 text-sm">No logins recorded yet.</div>
            )}
            {history?.map((h) => (
              <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-300">{h.browser}</span>
                  <span className="text-gray-600 mx-2">·</span>
                  <span className="text-gray-500">{h.device}</span>
                  <span className="text-gray-600 mx-2">·</span>
                  <span className="text-gray-500">{h.ip}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${h.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {h.success ? 'Success' : 'Failed'}
                  </span>
                  <span className="text-xs text-gray-600">{new Date(h.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
