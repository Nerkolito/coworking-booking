// 📦 Import Express types and User model
import { Request, Response } from "express";
import User from "../models/User";

// 📋 Get all users – GET /api/users (Admin only)
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all users but exclude passwords
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err);
    res.status(500).json({ message: "Kunde inte hämta användare" });
  }
};

// ❌ Delete a user – DELETE /api/users/:id (Admin only)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "Användaren hittades inte" });
      return;
    }

    res.status(200).json({ message: "Användare raderad" });
  } catch (err) {
    console.error("Fel vid radering av användare:", err);
    res.status(500).json({ message: "Kunde inte radera användaren" });
  }
};
