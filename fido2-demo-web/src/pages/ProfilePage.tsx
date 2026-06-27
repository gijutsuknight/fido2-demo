import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuthStore } from '../lib/store'

interface UserProfile {
  username: string
  displayName: string
  email: string
  credentialCount: number
  createdAt: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const qc = useQueryClient()

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/me').then((r) => r.data),
  })

  const [form, setForm] = useState({ displayName: '', email: '' })
  const [success, setSuccess] = useState(false)

  const updateMutation = useMutation({
    mutationFn: () => api.put('/me', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    },
  })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← Back</Link>
          <h1 className="text-xl font-bold text-white">Profile</h1>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Username</div>
            <div className="text-white font-mono">{profile?.username}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Member since</div>
            <div className="text-gray-300 text-sm">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <h2 className="text-white font-semibold">Update Profile</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Display Name</label>
            <input
              type="text"
              placeholder={profile?.displayName}
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              placeholder={profile?.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {success && (
            <div className="text-green-400 text-sm">Profile updated!</div>
          )}

          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Save Changes
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 rounded-xl py-3 text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
