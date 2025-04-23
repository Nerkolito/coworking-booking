import express from "express";
import {
  login,
  registerAdmin,
  registerUser,
} from "../controller/authController";

const router = express.Router();

router.post("/login", login);
router.post("/register", registerUser); // 👈 for regular users
router.post("/register-admin", registerAdmin); // 👈 for admins only

export default router;
