import mongoose from "mongoose";

//  Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the MONGO_URI from environment variables
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log(" MongoDB connected");
  } catch (err) {
    //  If connection fails, log error and exit process
    console.error(" MongoDB connection failed:", err);
    process.exit(1); // Exit with failure code
  }
};

//  Export the connectDB function so it can be used in server.ts
export default connectDB;
