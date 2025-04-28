import { Request, Response } from "express";
import User from "../models/User";

// Hämtar alla användare (endast Admin)
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Hittar alla användare, men tar bort lösenord från resultatet
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Fel vid hämtning av användare:", err);
    res.status(500).json({ message: "Kunde inte hämta användare" });
  }
};

// Tar bort en specifik användare (endast Admin)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    // Försöker hitta och ta bort användaren med angivet ID
    const user = await User.findByIdAndDelete(id);

    // Om användaren inte finns, returnera fel
    if (!user) {
      res.status(404).json({ message: "Användaren hittades inte" });
      return;
    }

    // Bekräftelse på att användaren tagits bort
    res.status(200).json({ message: "Användare raderad" });
  } catch (err) {
    console.error("Fel vid radering av användare:", err);
    res.status(500).json({ message: "Kunde inte radera användaren" });
  }
};
