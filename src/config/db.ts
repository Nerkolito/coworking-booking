import mongoose from "mongoose";

// Funktion som kopplar upp mot MongoDB
const connectDB = async () => {
  try {
    // Försök ansluta till databasen med MONGO_URI från miljövariabler (.env)
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("✅ MongoDB ansluten");
  } catch (err) {
    // Om anslutningen misslyckas, skriv ut felet och avsluta programmet
    console.error("❌ Kunde inte ansluta till MongoDB:", err);
    process.exit(1); // Avsluta applikationen med felkod
  }
};

// Exporterar funktionen så den kan användas i server.ts
export default connectDB;
