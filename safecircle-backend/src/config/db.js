const mongoose = require("mongoose");
require("dotenv").config();  // Load .env file

const connectDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);  // Debugging

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined. Check your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI, {
        });

        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
