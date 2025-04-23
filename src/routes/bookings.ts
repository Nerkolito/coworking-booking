import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../controller/bookingController";

const router = express.Router();

// Requires auth middleware
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

router.use(authenticate);
router.post("/", createBooking);
router.get("/", getMyBookings);
router.get("/all", authorizeAdmin, getAllBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
