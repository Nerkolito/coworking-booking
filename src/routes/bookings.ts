// Importerar Express och funktioner från bookingController
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

// Alla routes här kräver att användaren är inloggad (JWT-token)
router.use(authenticate);

// Hämta alla bokningar (endast för Admin)
router.get("/all", authorizeAdmin, getAllBookings);

// Hämta inloggad användares egna bokningar
router.get("/", getMyBookings);

// Skapa en ny bokning (både User och Admin kan boka)
router.post("/", createBooking);

// Uppdatera en bokning (endast skaparen eller Admin)
router.put("/:id", updateBooking);

// Ta bort en bokning (endast skaparen eller Admin)
router.delete("/:id", deleteBooking);

// Exporterar router för att användas i server.ts
export default router;
