// 📦 Import Express types and Room model
import { Request, Response, NextFunction } from "express";
import Room from "../models/Room";
import redis from "../config/redisClient";

// 🏗️ Create a new Room – POST /api/rooms
export const createRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { name, capacity, type } = req.body;

    // Validate input
    if (!name || !capacity || !type) {
      res.status(400).json({ message: "Alla fält måste fyllas i" });
      return;
    }

    // Save new Room
    const newRoom = new Room({ name, capacity, type });
    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Kunde inte skapa rum", error: err });
  }
};

// 📋 Get all Rooms – GET /api/rooms (with Redis caching)
export const getAllRooms = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Try fetching rooms from Redis first
    const cachedRooms = await redis.get("rooms");

    if (cachedRooms) {
      console.log("🚀 Hittade rum i cache");
      res.status(200).json(JSON.parse(cachedRooms));
      return;
    }

    // If not in cache - fetch from MongoDB
    const rooms = await Room.find();

    // Save rooms to cache for 60 seconds
    await redis.set("rooms", JSON.stringify(rooms), { EX: 60 });

    console.log("✅ Hittade rum i databasen och sparade i cache");
    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Kunde inte hämta rum" });
  }
};

// ✏️ Update a Room – PUT /api/rooms/:id
export const updateRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, capacity, type } = req.body;

    if (!name || !capacity || !type) {
      res.status(400).json({ message: "Alla fält måste fyllas i" });
      return;
    }

    // Update Room by ID
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name, capacity, type },
      { new: true } // Return updated document
    );

    if (!updatedRoom) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ message: "Kunde inte uppdatera rum", error: err });
  }
};

// ❌ Delete a Room – DELETE /api/rooms/:id
export const deleteRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    res.status(200).json({ message: "Rummet har tagits bort" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ message: "Kunde inte ta bort rum", error: err });
  }
};
