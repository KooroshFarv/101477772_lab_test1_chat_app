import { useNavigate, useParams } from "react-router-dom"
import { useRef } from "react"
import { useState, useEffect } from "react"
import { getSocket } from "../lib/socket"
import { getUser } from "../lib/auth"

export default function ChatRoom() {
  const { room } = useParams()
  const Nav = useNavigate()
  const roomN = decodeURIComponent(room || '')

  const me = getUser()

  const socketRef = useRef(null)
  const [status, setStatus] = useState('connecting')
  const [text, setText] = useState('')
  const[messages, setMessages] = useState([])

 useEffect(() => {
    socketRef.current = getSocket();

    if (!socketRef.current.connected) socketRef.current.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const joined = ({ room }) => setStatus(`joined ${room}`);

    const system = (m) => {
      if (m.room !== roomN) return;
      setMessages((prev) => [...prev, { type: "system", text: m.text }]);
    };

    const onNew = (m) => {
      if (m.room !== roomN) return;
      setMessages((prev) => [...prev, { type: "chat", ...m }]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room:joined", joined);
    socket.on("room:system", system);
    socket.on("message:new", onNew);

    socket.emit("room:join", { room: roomN });

    return () => {
      socket.emit("room:leave", { room: roomN });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room:joined", joined);
      socket.off("room:system", system);
      socket.off("message:new", onNew);
    };
  }, [roomN]);

   function leaveRoom() {
    const socket = socketRef.current
    socket.emit('room:leave', {room: roomN})
    Nav('/rooms')
   }


  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const socket = socketRef.current;
    socket.emit("message:send", { room: roomN, text });
    setText("")
  }



  return (
    <div className="min-h-screen w-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Room: {roomN}</h1>
            <p className="text-slate-300 text-sm mt-1">
              {me?.username} • {status}
            </p>
          </div>

          <button
            onClick={leaveRoom}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2"
          >
            Leave room
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-800 border border-slate-700 p-4 h-[420px] overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-slate-300">No messages yet</div>
          ) : (
            messages.map((m, idx) => {
              if (m.type === "system") {
                return (
                  <div key={idx} className="text-slate-400 text-sm">
                    {m.text}
                  </div>
                );
              }

              const mine = m.user?.username === me?.username;
              return (
                <div
                  key={idx}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[75%] rounded-2xl border border-slate-700 bg-slate-900 p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      {mine ? "You" : m.user?.username}
                    </div>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-xl bg-slate-900 p-3 outline-none border border-slate-700 focus:border-slate-400"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="rounded-xl bg-green-600 hover:bg-green-500 px-5 font-semibold">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}