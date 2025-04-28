// Importerar Express och funktioner från roomController
import express from "express";
import {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from "../controller/roomController";

import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Alla routes här kräver att användaren är inloggad (JWT-token)
router.use(authenticate);

// Hämta alla tillgängliga rum (både User och Admin kan se)
router.get("/", getAllRooms);

// Skapa ett nytt rum (endast Admin kan skapa)
router.post("/", authorizeAdmin, createRoom);

// Uppdatera ett rum (endast Admin)
router.put("/:id", authorizeAdmin, updateRoom);

// Ta bort ett rum (endast Admin)
router.delete("/:id", authorizeAdmin, deleteRoom);

// Exporterar router för att användas i server.ts
export default router;
