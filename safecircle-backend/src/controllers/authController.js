const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, address, aadhar, phone, email, dob, gender, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Store password as plain text (NOT RECOMMENDED FOR PRODUCTION)
        user = new User({ name, address, aadhar, phone, email, dob, gender, password });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Directly compare passwords (BAD PRACTICE FOR REAL APPS)
        if (password !== user.password) {
            return res.status(400).json({ message: "Username or password is incorrect!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { bloodGroup, medicalConditions, profileImage, address, aadhar, dob } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, // Get user ID from JWT token middleware
            { bloodGroup, medicalConditions, profileImage, address, aadhar, dob },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete User Profile
exports.deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id); // Delete user by ID
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
