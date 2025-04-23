import { Request, Response } from "express";
import Booking from "../models/Booking";
import Room from "../models/Room";
import { io } from "../server"; // adjust path if needed

// 📦 Skapa ny bokning
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
    // Kontrollera att rummet finns
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    // Kontrollera om bokningen krockar
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

    const newBooking = new Booking({
      user: req.user!.userId, // Kommer från JWT middleware
      room,
      startTime,
      endTime,
    });

    await newBooking.save();

    // Skicka meddelande till alla anslutna klienter via Socket.IO
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

// 📋 Hämta inloggad användares bokningar
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

// 🛡️ Hämta alla bokningar – endast admin
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

// ✏️ Uppdatera bokning (user eller admin)
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

    // Kontroll: Endast skaparen eller admin
    if (
      booking.user.toString() !== req.user!.userId &&
      req.user!.role !== "Admin"
    ) {
      res.status(403).json({ message: "Inte tillåtet" });
      return;
    }

    // Krockkontroll (förenklad)
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

    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();
    // ✅ Real-time notification
    io.emit("booking:updated", {
      message: "En bokning har uppdaterats",
      booking,
    });

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Det gick inte att uppdatera bokningen" });
  }
};

// ❌ Ta bort bokning
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

    // Kontroll: Endast skaparen eller admin
    if (
      booking.user.toString() !== req.user!.userId &&
      req.user!.role !== "Admin"
    ) {
      res.status(403).json({ message: "Inte tillåtet" });
      return;
    }

    await booking.deleteOne();

    io.emit("booking:deleted", {
      message: "En bokning har raderats",
      bookingId: booking._id,
    });
    res.status(200).json({ message: "Bokningen raderades" });
  } catch (err) {
    res.status(500).json({ message: "Fel vid radering av bokning" });
  }
};
