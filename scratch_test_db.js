import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function testConnection() {
    console.log("Testing connection to:", MONGO_URI.replace(/:([^@]+)@/, ":****@"));
    try {
        await mongoose.connect(MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 15000,
        });
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Connection Error:");
        console.error(err);
        process.exit(1);
    }
}

testConnection();
