import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// 🔐 Hjälpfunktion för att skapa en JWT-token
const generateToken = (userId: string, role: "User" | "Admin") => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d", // Giltig i 1 dag
  });
};

// ✅ Skapa adminanvändare - POST /api/auth/register-admin
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  // Kontroll om allt är ifyllt
  if (!username || !password) {
    res.status(400).json({ message: "Ange användarnamn och lösenord" });
    return;
  }

  try {
    // Kontrollera om användarnamn redan finns
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Användarnamnet används redan" });
      return;
    }

    // Skapa ny adminanvändare
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

// ✅ Registrera vanlig användare - POST /api/auth/register
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  // Kontroll om allt är ifyllt
  if (!username || !password) {
    res.status(400).json({ message: "Ange användarnamn och lösenord" });
    return;
  }

  try {
    // Kontrollera om användarnamn redan finns
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Användarnamnet används redan" });
      return;
    }

    // Skapa ny vanlig användare
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

// ✅ Logga in användare - POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Hämta användaren från databasen
    const user = await User.findOne({ username });

    // Om användaren inte finns eller är felaktig
    if (!user || !(user instanceof User)) {
      res.status(400).json({ message: "Fel användarnamn eller lösenord" });
      return;
    }

    // Jämför lösenordet
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Fel användarnamn eller lösenord" });
      return;
    }

    // Skapa och skicka tillbaka en JWT-token
    const token = generateToken(user.id.toString(), user.role);
    res.status(200).json({ token });
  } catch (err) {
    console.error("Fel vid inloggning:", err);
    res.status(500).json({ message: "Serverfel vid inloggning" });
  }
};
