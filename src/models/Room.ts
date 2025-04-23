import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  type: { type: String, enum: ["arbetsplats", "konferensrum"], required: true },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
