import express from "express";
import { getAllUsers, deleteUser } from "../controller/userController";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate); // All routes require login
router.get("/", authorizeAdmin, getAllUsers); // List all users (admin only)
router.delete("/:id", authorizeAdmin, deleteUser); // Delete user (admin only)

export default router;
