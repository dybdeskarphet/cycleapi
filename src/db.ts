import "dotenv/config";
import mongoose from "mongoose";
import { consola } from "consola";

if (!process.env.MONGODB_URI) {
  console.error("No database URI specified in .env");
}

const connectDatabase = async (filename: string) => {
  try {
    consola.info(`MongoDB connecting in ${filename}`);
    await mongoose.connect(process.env.MONGODB_URI as string);
    consola.info(`MongoDB connected in ${filename}`);
  } catch (error) {
    consola.error(`MongoDB connection error:\n${error}`);
    process.exit(1);
  }
};

export default connectDatabase;
