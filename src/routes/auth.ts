// 📦 Import dependencies
import express from "express";
import {
  login,
  registerAdmin,
  registerUser,
} from "../controller/authController";

const router = express.Router();

// ✅ POST /api/auth/login
// User login and receive JWT
router.post("/login", login);

// ✅ POST /api/auth/register-admin
// Admin user registration (for initial setup)
router.post("/register-admin", registerAdmin);

// ✅ POST /api/auth/register
// Regular user registration
router.post("/register", registerUser);

export default router;
