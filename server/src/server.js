import "dotenv/config"
import express from "express"
import http from "http"
import cors from "cors"
import mongoose from "mongoose"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import authRoutes from "./routes/auth.js"

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.send("running"));
app.use("/api/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
})

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("no token"));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    next(new Error('invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log("connected:", socket.id, socket.user?.username);

  socket.on('room:join', ({ room }) => {
    if (!room) return

    socket.join(room)

    socket.emit('room:joined', { room })

    socket.to(room).emit('room:system', {
      room,
      text: `${socket.user.username} joined`,
    })
  })

  socket.on('room:leave', ({ room }) => {
    if (!room) return

    socket.leave(room)

    socket.emit("room:left", { room })

    socket.to(room).emit("room:system", {
      room,
      text: `${socket.user.username} left`,
    });
  });
  socket.on("message:send", ({ room, text }) => {
    if (!room) return;
    if (!text || !text.trim()) return;

    const msg = {
      room,
      text: text.trim(),
      user: socket.user, 
      at: new Date().toISOString(),
    }
    io.to(room).emit("message:new", msg);
  })

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id, socket.user?.username);
  })
})

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB connected");
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => console.log(`server running on ${PORT}`));
} catch (err) {
  console.error("DB error", err.message);
  process.exit(1);
}