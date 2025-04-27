// 📦 Import Express types and Room model
import { Request, Response, NextFunction } from "express";
import Room from "../models/Room";
import redisClient from "../config/redisClient";

// 🏗️ Create a new Room – POST /api/rooms
export const createRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const { name, capacity, type } = req.body;

    if (!name || !capacity || !type) {
      res.status(400).json({ message: "Alla fält måste fyllas i" });
      return;
    }

    const newRoom = new Room({ name, capacity, type });
    const savedRoom = await newRoom.save();

    // Rensa cache eftersom vi skapat ett nytt rum
    await redisClient.del("rooms:all");

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
    const cacheKey = "rooms:all";

    const cachedRooms = await redisClient.get(cacheKey);

    if (cachedRooms) {
      console.log("✅ Redis cache hit - returning rooms from cache.");
      res.status(200).json(JSON.parse(cachedRooms));
      return;
    }

    console.log("🛑 Redis cache miss - fetching rooms from MongoDB.");
    const rooms = await Room.find();

    await redisClient.set(cacheKey, JSON.stringify(rooms), { EX: 3600 }); // 1h

    console.log("✅ Rooms cached in Redis.");
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

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name, capacity, type },
      { new: true }
    );

    if (!updatedRoom) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    // Rensa cache efter uppdatering
    await redisClient.del("rooms:all");

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

    // Rensa cache efter borttagning
    await redisClient.del("rooms:all");

    res.status(200).json({ message: "Rummet har tagits bort" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ message: "Kunde inte ta bort rum", error: err });
  }
};
