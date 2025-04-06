const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true,unique: true },
    address: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Ensures exactly 10 digits
        },
        message: "Phone number must be exactly 10 digits.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v); // Standard email format
        },
        message: "Invalid email format.",
      },
    },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true }, // Storing plain text (but should be hashed in production)
    bloodGroup: { type: String },
    medicalConditions: { type: String },
    profileImage: { type: String },

    // Default emergency options
    reportOptions: {
      type: [
        {
          name: { type: String, required: true },
          contacts: { type: [String], default: [] },
          procedure: { type: String, default: "" },
        },
      ],
      default: [
        { name: "Threat", contacts: [], procedure: "" },
        { name: "Accident", contacts: [], procedure: "" },
        { name: "Medical Emergency", contacts: [], procedure: "" },
        { name: "Fire", contacts: [], procedure: "" },
        { name: "Natural Disaster", contacts: [], procedure: "" },
      ],
    },

    // Emergency alert history
    history: {
      type: [
        {
          type: { type: String, required: true }, // Type of emergency
          phoneNumber: { type: String, required: true }, // Phone number the alert was sent to
          procedure: { type: String, required: true }, // Procedure
          timestamp: { type: Date, default: Date.now }, // Timestamp
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
