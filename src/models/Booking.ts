import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
}

const BookingSchema: Schema<IBooking> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
