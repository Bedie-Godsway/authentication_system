import mongoose from "mongoose";
import "dotenv/config";

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    // Attempt to connect to the database using the connection string from environment variables
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection successful.");
  } catch (error) {
    console.log("Database connection error:", error);
  }
};

export default connectToDatabase;