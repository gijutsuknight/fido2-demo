import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/api'

interface Credential {
  id: number
  credentialId: string
  aaguid: string | null
  transports: string[]
  signCount: number
  createdAt: string
  lastUsed: string | null
}

export default function CredentialsPage() {
  const qc = useQueryClient()

  const { data: credentials, isLoading } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: () => api.get('/credentials').then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/credentials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['credentials'] }),
  })

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← Back</Link>
          <h1 className="text-xl font-bold text-white">Passkeys</h1>
        </div>

        {isLoading && <div className="text-gray-500 text-sm">Loading…</div>}

        {credentials?.length === 0 && (
          <div className="text-gray-500 text-sm">No passkeys registered.</div>
        )}

        <div className="space-y-3">
          {credentials?.map((c) => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-mono text-gray-300 truncate max-w-xs">
                    {c.credentialId.slice(0, 24)}…
                  </div>
                  {c.transports.length > 0 && (
                    <div className="flex gap-1.5">
                      {c.transports.map((t) => (
                        <span key={t} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Sign count: {c.signCount} · Registered: {new Date(c.createdAt).toLocaleDateString()}
                    {c.lastUsed && ` · Last used: ${new Date(c.lastUsed).toLocaleDateString()}`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this passkey?')) deleteMutation.mutate(c.id)
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-400 text-sm border border-red-900 px-3 py-1 rounded-lg disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
