import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { saveAuth } from "../lib/auth"
import { reconnectSocket } from "../lib/socket"

export default function Login() {
  const nav = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { username, password })
      saveAuth(res.data)
      reconnectSocket()
      nav('/rooms')
    } catch (err) {
      setMsg(err?.response?.data?.error || 'Login failed')
    } finally {
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
              <div className="text-xs text-white/50">Socket.io + MongoDB</div>
            </div>
          </div>

          <Link
            to="/signup"
            className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </div>
        <div className="px-6 py-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-white/60">
              Log in to join rooms and chat in real time.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="text-sm text-white/60">Username</label>
                  <input
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25 focus:bg-white/7"
                    placeholder="e.g. koori"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-sm text-white/60">Password</label>
                  <input
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/25 focus:bg-white/7"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {msg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {msg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <button
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 font-semibold disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>

                <div className="text-sm text-white/55">
                  New here?{" "}
                  <Link
                    className="text-white/80 hover:text-white underline-offset-4 hover:underline"
                    to="/signup"
                  >
                    Create an account
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