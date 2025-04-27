// 📦 Import Mongoose types
import mongoose, { Schema, Document } from "mongoose";

// 🧩 Define a TypeScript interface for Booking documents
export interface IBooking extends Document {
  user: mongoose.Types.ObjectId; // Reference to a User
  room: mongoose.Types.ObjectId; // Reference to a Room
  startTime: Date; // Start time of the booking
  endTime: Date; // End time of the booking
}

// 📄 Create Mongoose Schema for Booking
const BookingSchema: Schema<IBooking> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

// 📤 Export Booking model
export default mongoose.model<IBooking>("Booking", BookingSchema);
