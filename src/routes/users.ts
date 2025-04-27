// 📦 Import dependencies
import express from "express";
import { getAllUsers, deleteUser } from "../controller/userController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// 🛡️ Protect all /users routes - authentication required
router.use(authenticate);

// 📋 GET /api/users
// Admin: List all users
router.get("/", authorizeAdmin, getAllUsers);

// ❌ DELETE /api/users/:id
// Admin: Delete a specific user
router.delete("/:id", authorizeAdmin, deleteUser);

export default router;
