// Importerar Express och funktioner från userController
import express from "express";
import { getAllUsers, deleteUser } from "../controller/userController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Alla routes här kräver att användaren är inloggad (måste ha en giltig JWT-token)
router.use(authenticate);

// Hämta alla användare (endast Admin har rättigheter)
router.get("/", authorizeAdmin, getAllUsers);

// Radera en användare baserat på ID (endast Admin har rättigheter)
router.delete("/:id", authorizeAdmin, deleteUser);

// Exporterar router så att den kan användas i server.ts
export default router;
