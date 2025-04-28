import mongoose from "mongoose";

// Definierar ett schema för rum i databasen
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Namnet på rummet, måste anges
  },
  capacity: {
    type: Number,
    required: true, // Antal personer rummet rymmer
  },
  type: {
    type: String,
    enum: ["arbetsplats", "konferensrum"], // Begränsar till endast dessa två typer
    required: true,
  },
});

// Skapar och exporterar Room-modellen så att vi kan använda den i andra filer
const Room = mongoose.model("Room", roomSchema);
export default Room;
