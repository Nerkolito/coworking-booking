import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import bookingRoutes from "./routes/bookings";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/rooms";
import userRoutes from "./routes/users";
import connectDB from "./config/db";

// Laddar miljövariabler från .env-filen
dotenv.config();

// Ansluter till MongoDB
connectDB();

// Skapar en Express-app och en HTTP-server
const app = express();
const server = http.createServer(app);

// Sätter upp Socket.IO för realtidsuppdateringar
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Tillåter alla domäner
  },
});

// Lyssnar efter WebSocket-anslutningar
io.on("connection", (socket) => {
  console.log(`🟢 Ny socket-anslutning: ${socket.id}`);
});

// Serverar statiska filer (t.ex. index.html för notifieringar)
app.use(express.static(path.join(__dirname, "../public")));

// Middleware för att hantera CORS och JSON-data
app.use(cors());
app.use(express.json());

// API-rutter
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

// Startar servern
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
