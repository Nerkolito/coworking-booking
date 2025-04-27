//  Import core modules
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

//  Import internal modules (routes + DB config)
import bookingRoutes from "./routes/bookings";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/rooms";
import userRoutes from "./routes/users";
import connectDB from "./config/db";

//  Load environment variables (from .env)
dotenv.config();

//  Connect to MongoDB (important to load after dotenv)
connectDB();

//  Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//  Create Socket.IO server for real-time notifications
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
  },
});

//  Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);
});

//  Serve static files (like index.html for notifications frontend)
app.use(express.static(path.join(__dirname, "../public")));

//  Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON

//  Mount API routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

//  Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
