import { Request, Response } from "express";
import Booking from "../models/Booking";
import Room from "../models/Room";
import { io } from "../server";

// Skapar en ny bokning – POST /api/bookings
export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { room, startTime, endTime } = req.body;

  // Säkerställ att alla fält är ifyllda
  if (!room || !startTime || !endTime) {
    res.status(400).json({ message: "Fyll i alla fält" });
    return;
  }
  // Kontrollera att start- och sluttider är giltiga datum
  if (new Date(endTime) <= new Date(startTime)) {
    res.status(400).json({ message: "Sluttiden måste vara efter starttiden" });
    return;
  }

  try {
    // Kontrollera att rummet finns
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      res.status(404).json({ message: "Rummet hittades inte" });
      return;
    }

    // Kontrollera så att bokningen inte krockar med annan bokning
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

    // Spara ny bokning i databasen
    const newBooking = new Booking({
      user: req.user!.userId,
      room,
      startTime,
      endTime,
    });

    await newBooking.save();

    // Skicka realtidsnotis om ny bokning
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

// Hämta nuvarande användarens bokningar – GET /api/bookings
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

// Hämta alla bokningar (endast admin) – GET /api/bookings/all
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

// Uppdatera en bokning – PUT /api/bookings/:id
export const updateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { startTime, endTime } = req.body;

  // Kontrollera att starttid är före sluttid
  if (new Date(endTime) <= new Date(startTime)) {
    res.status(400).json({ message: "Sluttiden måste vara efter starttiden" });
    return;
  }

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: "Bokningen hittades inte" });
      return;
    }

    // Kontrollera att det är skaparen eller admin som försöker ändra
    if (
      booking.user.toString() !== req.user!.userId &&
      req.user!.role !== "Admin"
    ) {
      res.status(403).json({ message: "Inte tillåtet" });
      return;
    }

    // Kontrollera att tiden inte krockar med en annan bokning
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

    // Uppdatera bokningen
    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    // Skicka realtidsnotis om ändring
    io.emit("booking:updated", {
      message: "En bokning har uppdaterats",
      booking,
    });

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Det gick inte att uppdatera bokningen" });
  }
};

// Radera en bokning – DELETE /api/bookings/:id
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

    // Kontrollera att det är skaparen eller admin som försöker radera
    if (
      booking.user.toString() !== req.user!.userId &&
      req.user!.role !== "Admin"
    ) {
      res.status(403).json({ message: "Inte tillåtet" });
      return;
    }

    await booking.deleteOne();

    // Skicka realtidsnotis om radering
    io.emit("booking:deleted", {
      message: "En bokning har raderats",
      bookingId: booking._id,
    });

    res.status(200).json({ message: "Bokningen raderades" });
  } catch (err) {
    res.status(500).json({ message: "Fel vid radering av bokning" });
  }
};
