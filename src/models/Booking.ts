import mongoose, { Schema, Document } from "mongoose";

// Definierar ett TypeScript-interface för en bokning
export interface IBooking extends Document {
  user: mongoose.Types.ObjectId; // Länkar till en användare
  room: mongoose.Types.ObjectId; // Länkar till ett rum
  startTime: Date; // När bokningen börjar
  endTime: Date; // När bokningen slutar
}
// Skapar ett Mongoose-schema för bokningar
const BookingSchema: Schema<IBooking> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Referens till User-modellen
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room", // Referens till Room-modellen
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

// Exporterar Mongoose-modellen så den kan användas i andra filer
export default mongoose.model<IBooking>("Booking", BookingSchema);
