import "dotenv/config"
import express from "express"
import http from "http"
import cors from "cors"
import mongoose from "mongoose"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import authRoutes from "./routes/auth.js"
import Message from "./models/Message.js"
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
    if (!token) return next(new Error("no token"))

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.sub, username: payload.username }
    next();
  } catch (err) {
    next(new Error("invalid token"));
  }
})

io.on("connection", (socket) => {
  console.log("connected:", socket.id, socket.user?.username)


  socket.on("room:join", ({ room }) => {
    if (!room) return;

    socket.join(room);

    socket.emit("room:joined", { room });

    socket.to(room).emit("room:system", {
      room,
      text: `${socket.user.username} joined`,
    })
  })

  socket.on("room:leave", async ({ room }) => {
    if (!room) return;

    await socket.leave(room);

    socket.emit("room:left", { room });

    socket.to(room).emit("room:system", {
      room,
      text: `${socket.user.username} left`,
    })
  })


  socket.on("message:send", async ({ room, text }) => {
    if (!room) return;
    if (!text || !text.trim()) return;

    try {
      const msg = await Message.create({
        room,
        text: text.trim(),
        userId: socket.user.id,
        username: socket.user.username,
        type: "room",
      })

      io.to(room).emit("message:new", {
        room,
        type: "room",
        text: msg.text,
        user: { username: msg.username },
        createdAt: msg.createdAt,
      })
    } catch (err) {
      console.error("message save error:", err.message);
    }
  })


  socket.on("typing:start", ({ room }) => {
    if (!room) return;
    socket.to(room).emit("typing", {
      room,
      username: socket.user.username,
      isTyping: true,
    })
  })

  socket.on("typing:stop", ({ room }) => {
    if (!room) return;
    socket.to(room).emit("typing", {
      room,
      username: socket.user.username,
      isTyping: false,
    })
  })


  const dmRoomName = (a, b) => ["dm", a, b].sort().join(":")


  socket.on("private:join", ({ otherUser }) => {
    if (!otherUser || !otherUser.trim()) return;

    const a = socket.user.username;
    const b = otherUser.trim();
    const room = dmRoomName(a, b);

    socket.join(room);
    socket.emit("private:joined", { otherUser: b })
  })
  socket.on("private:leave", ({ otherUser }) => {
    if (!otherUser || !otherUser.trim()) return;

    const a = socket.user.username
    const b = otherUser.trim();
    const room = dmRoomName(a, b)

    socket.leave(room);
    socket.emit("private:left", { otherUser: b })
  })

  socket.on("private:send", async ({ toUser, text }) => {
    if (!toUser || !toUser.trim()) return;
    if (!text || !text.trim()) return;

    const from = socket.user.username;
    const to = toUser.trim();
    const room = dmRoomName(from, to);

    try {
      const msg = await Message.create({
        room: null,
        text: text.trim(),
        userId: socket.user.id,
        username: from,
        toUser: to,
        type: "private",
      })

      io.to(room).emit("private:new", {
        type: "private",
        from_user: from,
        to_user: to,
        message: msg.text,
        date_sent: msg.createdAt,
      })
    } catch (err) {
      console.error("private save error:", err.message);
    }
  })

  socket.on("private:typing:start", ({ otherUser }) => {
    if (!otherUser || !otherUser.trim()) return;

    const a = socket.user.username;
    const b = otherUser.trim();
    const room = dmRoomName(a, b);

    socket.to(room).emit("private:typing", { from: a, to: b, isTyping: true });
  });

  socket.on("private:typing:stop", ({ otherUser }) => {
    if (!otherUser || !otherUser.trim()) return;

    const a = socket.user.username;
    const b = otherUser.trim();
    const room = dmRoomName(a, b);

    socket.to(room).emit("private:typing", { from: a, to: b, isTyping: false });
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id, socket.user?.username);
  });
});

try {
  await mongoose.connect(process.env.MONGO_URL)
  console.log("DB connected")

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => console.log(`server running on ${PORT}`))
} catch (err) {
  console.error("DB error", err.message)
  process.exit(1)
}