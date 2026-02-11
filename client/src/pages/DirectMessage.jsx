import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSocket } from "../lib/socket"
import { getUser } from "../lib/auth"

export default function DirectMessage() {
  const nav = useNavigate()
  const me = getUser()

  const socketRef = useRef(null)

  const [otherUser, setOtherUser] = useState("")
  const [joined, setJoined] = useState(false)
  const [text, setText] = useState("")
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    socketRef.current = getSocket()
    const socket = socketRef.current

    if (!socket.connected) socket.connect()

    socket.on("private:joined", () => setJoined(true))

    socket.on("private:new", (m) => {
      setMessages((prev) => [...prev, m])
    })

    socket.on("private:typing", ({ isTyping }) => {
      setTyping(isTyping)
    })

    return () => {
      socket.off("private:joined")
      socket.off("private:new")
      socket.off("private:typing")
    }
  }, [])

  function joinDM() {
    if (!otherUser.trim()) return
    socketRef.current.emit("private:join", { otherUser })
  }

  function leaveDM() {
    socketRef.current.emit("private:leave", { otherUser })
    nav("/rooms")
  }

  function sendMessage(e) {
    e.preventDefault()
    if (!text.trim()) return

    socketRef.current.emit("private:send", {
      toUser: otherUser,
      text,
    })

    setText("")
  }

  function onTyping() {
    socketRef.current.emit("private:typing:start", { otherUser })
  }

  function onStopTyping() {
    socketRef.current.emit("private:typing:stop", { otherUser })
  }

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Direct Message</h1>
          <button
            onClick={() => nav("/rooms")}
            className="rounded-xl bg-slate-800 px-4 py-2"
          >
            Back
          </button>
        </div>

        {!joined && (
          <div className="flex gap-2 mb-6">
            <input
              className="flex-1 rounded-xl bg-slate-800 p-3"
              placeholder="Username to chat with"
              value={otherUser}
              onChange={(e) => setOtherUser(e.target.value)}
            />
            <button
              onClick={joinDM}
              className="rounded-xl bg-green-600 px-4"
            >
              Start
            </button>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-4 h-[400px] overflow-y-auto space-y-2">
          {messages.map((m, i) => {
            const mine = m.from_user === me.username
            return (
              <div
                key={i}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div className="bg-slate-900 rounded-xl p-3 max-w-[70%]">
                  <div className="text-xs text-slate-400 mb-1">
                    {mine ? "You" : m.from_user}
                  </div>
                  {m.message}
                </div>
              </div>
            )
          })}

          {typing && (
            <div className="text-sm text-slate-400">
              {otherUser} is typing...
            </div>
          )}
        </div>

        {joined && (
          <form onSubmit={sendMessage} className="flex gap-2 mt-4">
            <input
              className="flex-1 rounded-xl bg-slate-800 p-3"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onTyping}
              onBlur={onStopTyping}
            />
            <button className="rounded-xl bg-green-600 px-5">
              Send
            </button>
          </form>
        )}

        {joined && (
          <button
            onClick={leaveDM}
            className="mt-4 text-sm text-red-400"
          >
            Leave chat
          </button>
        )}
      </div>
    </div>
  )
}
