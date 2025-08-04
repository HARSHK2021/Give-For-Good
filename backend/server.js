import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from "socket.io";
import { setupSocket } from "./socket/socket.js";

import conversationRoutes from "./routes/conversationRoutes.js";

const PORT = process.env.PORT || 3000;
dotenv.config();
connectDB();

const app = express();


app.use(cors({
    origin: "*",
    credentials: true,
}
));
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => res.json({ message: "HelperHub Backend is Running" }));
app.use("/api/auth",authRoutes);
app.use("/api/items",itemRoutes)
app.use("/api/user/profile",userRoutes);

app.use("/api/conversations",conversationRoutes);
app.use("/api/messages",messageRoutes);



/// socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
pubClient.on('error', (err) => console.error('Redis Pub Client Error', err));


const subClient = pubClient.duplicate();



(async () => {
  await pubClient.connect();
  await subClient.connect();
    console.log('Connected to Redis');
  io.adapter(createAdapter(pubClient, subClient));
  setupSocket(io);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
