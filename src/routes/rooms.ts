import express from "express";
import {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from "../controller/roomController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate); // All room routes require auth

router.get("/", getAllRooms);
router.post("/", authorizeAdmin, createRoom);
router.put("/:id", authorizeAdmin, updateRoom);
router.delete("/:id", authorizeAdmin, deleteRoom);

export default router;
