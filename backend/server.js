import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js"
import cookieParser from "cookie-parser";



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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));