// 📦 Import Mongoose
import mongoose from "mongoose";

// 📄 Define Mongoose schema for Room
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Room name (e.g., "Konferensrum 1")
  capacity: { type: Number, required: true }, // How many people the room can hold
  type: {
    type: String,
    enum: ["arbetsplats", "konferensrum"], // Only allow these two types
    required: true,
  },
});

// 📤 Create and export Room model
const Room = mongoose.model("Room", roomSchema);
export default Room;
