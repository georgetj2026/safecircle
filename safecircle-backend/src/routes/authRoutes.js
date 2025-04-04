const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile, addHistory, getHistory, deleteHistory } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUserProfile);

// History Routes
router.post("/history", authMiddleware, addHistory);
router.get("/history", authMiddleware, getHistory);
router.delete("/history/:historyId", authMiddleware, deleteHistory);

module.exports = router;
