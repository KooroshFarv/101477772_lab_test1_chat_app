import { useNavigate } from "react-router-dom"
import { clearAuth, getUser } from "../lib/auth"

const ROOMS = ['devops',  'sports', 'nodeJS', 'cloud computing', 'covid19']

export default function Rooms() {
  const nav = useNavigate()
  const user = getUser()

  function logout() {
    clearAuth();
    nav('/login')
  }

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Rooms</h1>
            <p className="text-slate-300 mt-1">
              Logged in as <span className="text-green-400">{user?.username}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ROOMS.map((room) => (
            <button
              key={room}
              onClick={() => nav(`/chat/${encodeURIComponent(room)}`)}
              className="text-left rounded-2xl bg-slate-800 hover:bg-slate-700 p-4 border border-slate-700"
            >
              <div className="font-semibold">{room}</div>
              <div className="text-slate-300 text-sm mt-1">
                Join and chat in this room
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}