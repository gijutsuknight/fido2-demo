import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-6">🔐</div>
      <h1 className="text-4xl font-bold text-white mb-3">FIDO2 Demo Platform</h1>
      <p className="text-gray-400 max-w-lg text-lg mb-8">
        Experience passwordless authentication with WebAuthn passkeys.
        Register once, sign in instantly with biometrics or a security key.
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl transition-colors"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl">
        {[
          { icon: '🛡️', title: 'Phishing-resistant', desc: 'Cryptographic keys never leave your device' },
          { icon: '⚡', title: 'Instant login', desc: 'Touch ID or Face ID — no typing required' },
          { icon: '🔍', title: 'Protocol viewer', desc: 'Inspect raw WebAuthn messages in real-time' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-white font-medium text-sm mb-1">{f.title}</div>
            <div className="text-gray-500 text-xs">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
