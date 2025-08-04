import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";

import { Server } from "socket.io";
import { setupSocket } from "./socket/socket.js";

import conversationRoutes from "./routes/conversationRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: [ 'https://give-for-good-swart.vercel.app'],

    credentials: true,


}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "HelperHub Backend is Running" }));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/user/profile", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

/// socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://give-for-good-swart.vercel.app",
        credentials: true,
    },
});

setupSocket(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
