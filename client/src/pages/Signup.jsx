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
    <div className="min-h-screen w-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-slate-300 mt-1">Pick a unique username.</p>

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

          {message && <div className="text-red-300 text-sm">{message}</div>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-60 p-3 font-semibold"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-300">
          Already have an account?{" "}
          <Link className="text-green-400 hover:underline" to="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
)
}

export default Signup