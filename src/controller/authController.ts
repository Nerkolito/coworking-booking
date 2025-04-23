import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// 🔐 Skapar en JWT-token för användaren
const generateToken = (userId: string, role: "User" | "Admin") => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

// ✅ POST /api/auth/register-admin
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Ange användarnamn och lösenord" });
    return;
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Användarnamnet används redan" });
      return;
    }

    const newUser = new User({
      username,
      password,
      role: "Admin", // ✅ fixed!
    });

    await newUser.save();
    res.status(201).json({ message: "Admin användare skapad" });
  } catch (err) {
    console.error("Fel vid adminregistrering:", err);
    res.status(500).json({ message: "Kunde inte skapa admin" });
  }
};

// ✅ POST /api/auth/register (regular user)
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Ange användarnamn och lösenord" });
    return;
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Användarnamnet används redan" });
      return;
    }

    const newUser = new User({
      username,
      password,
      role: "User",
    });

    await newUser.save();
    res.status(201).json({ message: "Användare skapad" });
  } catch (err) {
    console.error("Fel vid registrering:", err);
    res.status(500).json({ message: "Kunde inte skapa användare" });
  }
};

// ✅ POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(user instanceof User)) {
      res.status(400).json({ message: "Fel användarnamn eller lösenord" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Fel användarnamn eller lösenord" });
      return;
    }

    const token = generateToken(user.id.toString(), user.role);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Fel vid inloggning:", err);
    res.status(500).json({ message: "Serverfel vid inloggning" });
  }
};
