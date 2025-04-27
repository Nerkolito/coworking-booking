// 📦 Import modules and models
import { Request, Response } from "express";
import Booking from "../models/Booking";
import Room from "../models/Room";
import { io } from "../server"; // For real-time notifications

// 📦 Create a new Booking – POST /api/bookings
export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { room, startTime, endTime } = req.body;

  if (!room || !startTime || !endTime) {
    res.status(400).json({ message: "Fyll i alla fält" });
    return;
  }

  try {
    // Check if room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      room,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) },
        },
      ],
    });

    if (overlapping) {
      res
        .status(409)
        .json({ message: "Rummet är redan bokat under den tiden" });
      return;
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user!.userId,
      room,
      startTime,
      endTime,
    });

    await newBooking.save();

    // 📡 Send real-time notification to connected clients
    io.emit("booking:created", {
      message: "Ny bokning skapad!",
      booking: newBooking,
    });

    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Fel vid bokning:", err);
    res.status(500).json({ message: "Det gick inte att skapa bokningen" });
  }
};

// 📋 Get current user's bookings – GET /api/bookings
export const getMyBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find({ user: req.user!.userId }).populate(
      "room"
    );
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Det gick inte att hämta bokningar" });
  }
};

// 🛡️ Get all bookings (admin only) – GET /api/bookings/all
export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find().populate("user").populate("room");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Det gick inte att hämta bokningar" });
  }
};

// ✏️ Update a Booking – PUT /api/bookings/:id
export const updateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { startTime, endTime } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: "Bokningen hittades inte" });
      return;
    }

    // Only the creator or Admin can update
    if (
      booking.user.toString() !== req.user!.userId &&
      req.user!.role !== "Admin"
    ) {
      res.status(403).json({ message: "Inte tillåtet" });
      return;
    }

    // Check for conflicts
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      room: booking.room,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) },
        },
      ],
    });

    if (conflict) {
      res.status(409).json({ message: "Tiden krockar med en annan bokning" });
      return;
    }

    // Update booking
    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    // 📡 Real-time update
    io.emit("booking:updated", {
      message: "En bokning har uppdaterats",
      booking,
    });

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Det gick inte att uppdatera bokningen" });
  }
};

// ❌ Delete a Booking – DELETE /api/bookings/:id
export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: "Bokningen hittades inte" });
      return;
    }

    // Only the creator or Admin can delete
    if (
      booking.user.toString() !== req.user!.userId &&
      req.user!.role !== "Admin"
    ) {
      res.status(403).json({ message: "Inte tillåtet" });
      return;
    }

    await booking.deleteOne();

    // 📡 Real-time notification for deletion
    io.emit("booking:deleted", {
      message: "En bokning har raderats",
      bookingId: booking._id,
    });

    res.status(200).json({ message: "Bokningen raderades" });
  } catch (err) {
    res.status(500).json({ message: "Fel vid radering av bokning" });
  }
};
