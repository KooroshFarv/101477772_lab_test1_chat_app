import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {api} from '../lib/api'


function Signup() {
    const Nav = useNavigate()
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

async function onSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
        await api.post('/api/auth/signup', {username, password})
        Nav('/login')
    } catch (err) {
        setMessage(err?.response?.data?.error || 'signup failed')
    }finally {
        setLoading(false)
    }
}
return (
  <div className="min-h-screen w-screen bg-[#0f1115] text-white">
    <div className="pointer-events-none fixed inset-0 opacity-[0.18]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.06),transparent_40%),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_100%,100%_100%,28px_28px,28px_28px]" />
    </div>

    <div className="relative">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <span className="text-xs tracking-widest text-white/80">CHAT</span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Lab Test 1</div>
            <div className="text-xs text-white/50">Realtime Chat App</div>
          </div>
        </div>

        <Link
          to="/login"
          className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </div>
      <div className="px-6 py-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-white/60">
            Choose a unique username to get start
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-white/60">Username</label>
                <input
                  className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25 focus:bg-white/7"
                  placeholder="e.g. koori"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="text-sm text-white/60">Password</label>
                <input
                  className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25 focus:bg-white/7"
                  placeholder="•••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {message && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 font-semibold disabled:opacity-60"
              >
                {loading ? "Creating..." : "Sign up"}
              </button>

              <div className="text-sm text-white/55">
                Already have an account?{" "}
                <Link
                  className="text-white/80 hover:text-white underline-offset-4 hover:underline"
                  to="/login"
                >
                  Log in
                </Link>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
);

}

export default Signup