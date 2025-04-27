// 📦 Import dependencies
import express from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBooking,
  deleteBooking,
} from "../controller/bookingController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// 🛡️ Protect all /bookings routes - authentication required
router.use(authenticate);

// 🛡️ GET /api/bookings/all
// Admin: See all bookings
router.get("/all", authorizeAdmin, getAllBookings);

// 📋 GET /api/bookings
// Regular user: See own bookings
router.get("/", getMyBookings);

// 📦 POST /api/bookings
// Create a new booking (User or Admin)
router.post("/", createBooking);

// ✏️ PUT /api/bookings/:id
// Update an existing booking (Owner or Admin)
router.put("/:id", updateBooking);

// ❌ DELETE /api/bookings/:id
// Delete a booking (Owner or Admin)
router.delete("/:id", deleteBooking);

export default router;
