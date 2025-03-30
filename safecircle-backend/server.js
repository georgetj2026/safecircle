const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require("./src/config/db");
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors({ origin: "*" })); // Allow all origins (for development)
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
//app.use("/api/user", require("./src/routes/userRoutes")); // ✅ Added userRoutes

// Debug: Log registered routes
console.log("Available routes:");
app._router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`✅ ${layer.route.path}`);s
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown (Ctrl+C)
process.on("SIGINT", async () => {
    console.log("🛑 Shutting down server...");
    await mongoose.connection.close();
    console.log("✅ MongoDB Disconnected.");
    process.exit(0);
});
