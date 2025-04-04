const Contact = require("../models/Contact");
const User = require("../models/User");
const { sendWhatsAppMessages } = require("../utils/whatsapp");

// Update a report option
const updateReportOption = async (req, res) => {
    try {
        console.log("🔍 Incoming request to update report option:", req.body); // Debugging log
        const { name, contacts, procedure } = req.body;
        const userId = req.user.id;

        console.log("🔍 User ID:", userId); // Debugging log

        const user = await User.findById(userId);
        if (!user) {
            console.log("⛔ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const optionIndex = user.reportOptions.findIndex((option) => option.name === name);
        if (optionIndex !== -1) {
            console.log("✅ Updating existing report option");
            user.reportOptions[optionIndex].contacts = contacts;
            user.reportOptions[optionIndex].procedure = procedure;
        } else {
            console.log("✅ Adding new report option");
            user.reportOptions.push({ name, contacts, procedure });
        }

        await user.save();
        res.status(200).json({ message: "Report option updated successfully", reportOptions: user.reportOptions });
    } catch (error) {
        console.error("⛔ Error updating report option:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all report options
const getReportOptions = async (req, res) => {
    try {
        console.log("🔍 Fetching report options for user ID:", req.user.id); // Debugging log
        const userId = req.user.id;

        const user = await User.findById(userId).select("reportOptions");
        if (!user) {
            console.log("⛔ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Fetched report options:", user.reportOptions); // Debugging log
        res.status(200).json(user.reportOptions);
    } catch (error) {
        console.error("⛔ Error fetching report options:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Send WhatsApp messages for a specific report option
const sendWhatsAppMessagesForOption = async (req, res) => {
    try {
        const { name, procedure, locationLink } = req.body;
        const userId = req.user.id;

        console.log("🔍 Fetching report option for user ID:", userId, "and option name:", name);

        const user = await User.findById(userId).select("reportOptions");
        if (!user) {
            console.log("⛔ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const reportOption = user.reportOptions.find((option) => option.name === name);
        if (!reportOption || reportOption.contacts.length === 0) {
            console.log("⛔ No contacts found for this report option");
            return res.status(404).json({ message: "No contacts found for this report option" });
        }

        // Construct the message
        const message = `⚠️⚠️ EMERGENCY ALERT ⚠️⚠️\nName: ${name}\nProcedure: ${procedure}\nLocation: ${locationLink}`;

        // Send WhatsApp messages to the contacts
        const contacts = reportOption.contacts;
        await sendWhatsAppMessages(message, contacts);

        res.status(200).json({ message: "WhatsApp messages sent successfully." });
    } catch (error) {
        console.error("⛔ Error sending WhatsApp messages:", error);
        res.status(500).json({ message: "Failed to send WhatsApp messages." });
    }
};

// ✅ Ensure all functions are properly exported
module.exports = {
    updateReportOption,
    getReportOptions,
    sendWhatsAppMessagesForOption,
};
