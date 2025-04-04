const express = require("express");
const { updateReportOption, getReportOptions } = require("../controllers/contactController");
const { sendWhatsAppMessages } = require("../utils/whatsapp");
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User"); // Import User model

const router = express.Router();

router.put("/report-options", authMiddleware, updateReportOption); // Update report options
router.get("/report-options", authMiddleware, getReportOptions); // Get report options

router.post("/send-whatsapp-messages", authMiddleware, async (req, res) => {
  try {
    const { name, procedure, locationLink, contacts } = req.body;

    if (!name || !procedure || !locationLink || !contacts) {
      return res.status(400).json({ message: "Name, procedure, location, and contacts are required." });
    }

    // Fetch user details from the database
    const userId = req.user.id; // Extract user ID from authMiddleware
    const user = await User.findById(userId).select("name phone"); // Fetch user's name and phone
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct the message
    const message = `⚠️⚠️EMERGENCY ALERT⚠️⚠️ __________Situation:${name}____________ Message From: ${user.name}......... From:${user.phone} ************** ${procedure}\n📌📌------LOCATION:------📌📌${locationLink}`;
    // Send WhatsApp messages
    await sendWhatsAppMessages(message, contacts);

    res.status(200).json({ message: "WhatsApp messages sent successfully." });
  } catch (error) {
    console.error("Error sending WhatsApp messages:", error);
    res.status(500).json({ message: "Failed to send WhatsApp messages." });
  }
});

module.exports = router;
