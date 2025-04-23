import { Request, Response, NextFunction } from "express";
import Room from "../models/Room";

//  Skapa ett nytt rum – POST /rooms
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

    res.status(201).json(savedRoom);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Kunde inte skapa rum", error: err });
  }
};

//  Hämta alla rum – GET /rooms
export const getAllRooms = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Kunde inte hämta rum" });
  }
};

//  Uppdatera rum – PUT /rooms/:id
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

    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error("Error updating room:", err);
    res.status(500).json({ message: "Kunde inte uppdatera rum", error: err });
  }
};

//  Ta bort rum – DELETE /rooms/:id
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
