import { useNavigate } from "react-router-dom"
import { clearAuth, getUser } from "../lib/auth"

const ROOMS = ["devops", "sports", "nodeJS", "cloud computing", "covid19"]

export default function Rooms() {
  const nav = useNavigate()
  const user = getUser()

  function logout() {
    clearAuth()
    nav("/login")
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
            <div className="font-semibold">Rooms</div>
            <div className="text-xs text-white/50">
              Logged in as{" "}
              <span className="text-white/80">{user?.username}</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-sm text-white/80"
        >
          Logout
        </button>
      </div>
      <div className="px-6 py-10">
        <div className="max-w-4xl">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Choose a room
              </h1>
              <p className="mt-2 text-white/60">
                Join one space at a time. Messages stay inside the room.
              </p>
            </div>

            <button
              onClick={() => nav("/dm")}
              className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-3 text-sm font-semibold"
            >
              Direct Message
            </button>
          </div>

          <div className="mt-8 border border-white/10 rounded-2xl overflow-hidden">
            {ROOMS.map((room, idx) => (
              <button
                key={room}
                onClick={() => nav(`/chat/${encodeURIComponent(room)}`)}
                className={`w-full text-left px-5 py-4 bg-white/[0.03] hover:bg-white/[0.06] transition flex items-center justify-between gap-4 ${
                  idx !== 0 ? "border-t border-white/10" : ""
                }`}
              >
                <div>
                  <div className="font-semibold capitalize">{room}</div>
                  <div className="text-sm text-white/50 mt-1">
                    Join and chat in {room}
                  </div>
                </div>

                <div className="text-white/40 text-sm">→</div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-xs text-white/40">
            Tip: Use Logout to clear localStorage session.
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
