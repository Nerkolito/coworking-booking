import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bookingRoutes from "./routes/bookings";
import authRoutes from "./routes/auth";
import connectDB from "./config/db";
import roomRoutes from "./routes/rooms";
import userRoutes from "./routes/users";

// Load env vars first
dotenv.config();

// Now connect to MongoDB (after env is loaded)
connectDB();

const app = express();
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);
});

// ✅ Serve static files like index.html
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
