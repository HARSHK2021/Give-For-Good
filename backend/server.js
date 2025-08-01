import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";


import { Server } from "socket.io";
import { setupSocket } from "./socket/socket.js";


dotenv.config();
connectDB();

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}
));
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => res.json({ message: "HelperHub Backend is Running" }));
app.use("/api/auth",authRoutes);
app.use("/api/items",itemRoutes)
app.use("/api/user/profile",userRoutes);


/// socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
setupSocket(io); // Uncomment this line to enable socket functionality





const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
