import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import authRoutes from './routes/auth.js'
const app = express();

app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());
app.use('/api/auth', authRoutes)
app.get('/', (req, res) => res.send('running'))

const server = http.createServer(app)
const io = new Server(server, {
    cors: {origin: 'http://localhost:5173'}
})

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('disconnect', () => {
        console.log(socket.id)
    })
})

try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('DB connected')
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => console.log(`server running on ${PORT}`))
} catch (err) {
    console.error('DB error', err.message)
    process.exit(1)
}
