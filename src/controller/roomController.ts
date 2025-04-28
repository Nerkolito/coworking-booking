import { Request, Response, NextFunction } from "express";
import Room from "../models/Room";
import redisClient from "../config/redisClient";

// Skapa nytt rum – POST /api/rooms
export const createRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { name, capacity, type } = req.body;

    // Säkerställ att alla fält är ifyllda
    if (!name || !capacity || !type) {
      res.status(400).json({ message: "Alla fält måste fyllas i" });
      return;
    }

    // Skapa och spara nytt rum i databasen
    const newRoom = new Room({ name, capacity, type });
    const savedRoom = await newRoom.save();

    // Töm cachen för rum (så att nästa hämtning visar uppdaterad data)
    await redisClient.del("rooms:all");

    res.status(201).json(savedRoom);
  } catch (err) {
    console.error("Fel vid skapande av rum:", err);
    res.status(500).json({ message: "Kunde inte skapa rum", error: err });
  }
};

// Hämta alla rum – GET /api/rooms (med Redis-caching)
export const getAllRooms = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const cacheKey = "rooms:all";

    // Försök hämta rum från Redis först
    const cachedRooms = await redisClient.get(cacheKey);

    if (cachedRooms) {
      console.log("✅ Rum hämtade från cache (Redis).");
      res.status(200).json(JSON.parse(cachedRooms));
      return;
    }

    // Om inget i cache, hämta från MongoDB
    console.log("🛑 Ingen cache - hämtar från databasen.");
    const rooms = await Room.find();

    // Spara resultatet i Redis i 1 timme
    await redisClient.set(cacheKey, JSON.stringify(rooms), { EX: 3600 });

    console.log("✅ Rum har lagrats i cache.");
    res.status(200).json(rooms);
  } catch (err) {
    console.error("Fel vid hämtning av rum:", err);
    res.status(500).json({ message: "Kunde inte hämta rum" });
  }
};

// Uppdatera ett rum – PUT /api/rooms/:id
export const updateRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, capacity, type } = req.body;

    // Kontrollera att alla nödvändiga fält är ifyllda
    if (!name || !capacity || !type) {
      res.status(400).json({ message: "Alla fält måste fyllas i" });
      return;
    }

    // Hitta och uppdatera rummet
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name, capacity, type },
      { new: true }
    );

    if (!updatedRoom) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    // Töm cache eftersom data ändrats
    await redisClient.del("rooms:all");

    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error("Fel vid uppdatering av rum:", err);
    res.status(500).json({ message: "Kunde inte uppdatera rum", error: err });
  }
};

// Ta bort ett rum – DELETE /api/rooms/:id
export const deleteRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Hitta och ta bort rummet
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    // Töm cache eftersom ett rum raderades
    await redisClient.del("rooms:all");

    res.status(200).json({ message: "Rummet har tagits bort" });
  } catch (err) {
    console.error("Fel vid borttagning av rum:", err);
    res.status(500).json({ message: "Kunde inte ta bort rum", error: err });
  }
};
