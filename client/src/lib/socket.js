
import { io } from "socket.io-client"
import { getToken } from "./auth"

let socket = null;

export function getSocket() {
  if (socket) return socket

  socket = io("http://localhost:3001", {
    autoConnect: false,
    auth: { token: getToken() },
  });

  return socket
}

export function reconnectSocket() {
  if (!socket) return
  socket.auth = { token: getToken() }
  if (!socket.connected) socket.connect()
}