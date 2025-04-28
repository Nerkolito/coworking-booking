// Importerar Express och funktioner från authController
import express from "express";
import {
  login,
  registerAdmin,
  registerUser,
} from "../controller/authController";

const router = express.Router();

// Inloggning för användare – returnerar JWT-token
router.post("/login", login);

// Registrering av adminanvändare (används t.ex. för första admin-kontot)
router.post("/register-admin", registerAdmin);

// Registrering av vanlig användare
router.post("/register", registerUser);

// Exporterar router för att användas i server.ts
export default router;
