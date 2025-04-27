// 📦 Import dependencies
import express from "express";
import {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from "../controller/roomController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// 🛡️ Protect all /rooms routes - authentication required
router.use(authenticate);

// 📋 GET /api/rooms
// Fetch all available rooms (User or Admin)
router.get("/", getAllRooms);

// 🏗️ POST /api/rooms
// Create a new room (Admin only)
router.post("/", authorizeAdmin, createRoom);

// ✏️ PUT /api/rooms/:id
// Update an existing room (Admin only)
router.put("/:id", authorizeAdmin, updateRoom);

// ❌ DELETE /api/rooms/:id
// Delete a room (Admin only)
router.delete("/:id", authorizeAdmin, deleteRoom);

export default router;
