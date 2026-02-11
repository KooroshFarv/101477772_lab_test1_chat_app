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
    <div className="min-h-screen w-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-slate-300 mt-1">Log in to join rooms.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-slate-900 p-3 outline-none border border-slate-700 focus:border-slate-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full rounded-xl bg-slate-900 p-3 outline-none border border-slate-700 focus:border-slate-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg && <div className="text-red-300 text-sm">{msg}</div>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-60 p-3 font-semibold"
          >
            {loading ? "Logging in" : "Log in"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-300">
          New here?{" "}
          <Link className="text-green-400 hover:underline" to="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}