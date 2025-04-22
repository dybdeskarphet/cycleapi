import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error("No database URI specified in .env");
}

const connectDatabase = async (filename: string) => {
  try {
    console.log(`MongoDB connecting in ${filename}`);
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB connected in ${filename}`);
  } catch (error) {
    console.error(`MongoDB connection error:\n${error}`);
    process.exit(1);
  }
};

export default connectDatabase;
