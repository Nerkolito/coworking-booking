// 📦 Import necessary modules
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// 🔐 Helper function: Generate JWT token for user
const generateToken = (userId: string, role: "User" | "Admin") => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d", // Token valid for 1 day
  });
};

// ✅ POST /api/auth/register-admin - Register an Admin user
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: "Ange användarnamn och lösenord" });
    return;
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Användarnamnet används redan" });
      return;
    }

    // Create new Admin user
    const newUser = new User({
      username,
      password,
      role: "Admin",
    });

    await newUser.save();
    res.status(201).json({ message: "Admin användare skapad" });
  } catch (err) {
    console.error("Fel vid adminregistrering:", err);
    res.status(500).json({ message: "Kunde inte skapa admin" });
  }
};

// ✅ POST /api/auth/register - Register a Regular User
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

    // Create new Regular user
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

// ✅ POST /api/auth/login - User login
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

    // Create and send token if successful
    const token = generateToken(user.id.toString(), user.role);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Fel vid inloggning:", err);
    res.status(500).json({ message: "Serverfel vid inloggning" });
  }
};
