import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

interface Step {
  label: string
  request: unknown
  response: unknown
}

export default function ProtocolViewerPage() {
  const [steps, setSteps] = useState<Step[]>([])
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  function addStep(label: string, request: unknown, response: unknown) {
    setSteps((prev) => [...prev, { label, request, response }])
  }

  async function traceRegistrationOptions() {
    setLoading(true)
    try {
      const req = { username, displayName, email }
      const { data } = await api.post('/register/options', req)
      addStep('POST /api/register/options', req, data)
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err)
      addStep('POST /api/register/options (ERROR)', { username, displayName, email }, { error })
    } finally {
      setLoading(false)
    }
  }

  async function traceLoginOptions() {
    setLoading(true)
    try {
      const req = { username }
      const { data } = await api.post('/login/options', req)
      addStep('POST /api/login/options', req, data)
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err)
      addStep('POST /api/login/options (ERROR)', { username }, { error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← Back</Link>
          <h1 className="text-xl font-bold text-white">WebAuthn Protocol Viewer</h1>
        </div>

        <p className="text-gray-400 text-sm">
          Inspect the raw request/response messages exchanged during registration and authentication.
        </p>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
          <h2 className="text-white font-medium">Parameters</h2>
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={traceRegistrationOptions}
              disabled={loading}
              className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              Trace Register Options
            </button>
            <button
              onClick={traceLoginOptions}
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              Trace Login Options
            </button>
            <button
              onClick={() => setSteps([])}
              className="text-gray-500 hover:text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="bg-gray-800 px-5 py-3 text-sm font-mono text-indigo-300">{step.label}</div>
              <div className="grid grid-cols-2 divide-x divide-gray-800">
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">Request</div>
                  <pre className="text-xs text-green-300 overflow-auto max-h-64 whitespace-pre-wrap">
                    {JSON.stringify(step.request, null, 2)}
                  </pre>
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase mb-2">Response</div>
                  <pre className="text-xs text-blue-300 overflow-auto max-h-64 whitespace-pre-wrap">
                    {JSON.stringify(step.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
          {steps.length === 0 && (
            <div className="text-center text-gray-600 py-12 text-sm">
              Click a button above to trace a WebAuthn API call
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
