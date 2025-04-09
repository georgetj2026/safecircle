const axios = require("axios");

// Load environment variables
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Sends a WhatsApp message to a list of contacts using the WhatsApp Cloud API.
 * @param {string} message - The message text to send.
 * @param {Array<string>} contacts - List of phone numbers (E.164 format).
 */
exports.sendWhatsAppMessages = async (message, contacts) => {
  if (!contacts || contacts.length === 0) {
    console.log("No contacts provided.");
    return;
  }

  console.log(`Sending message to ${contacts.length} contacts...`);

  const sendMessage = async (phoneNumber) => {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: {
            body: message, // Use the dynamic message
          },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Message sent to ${phoneNumber}:`, response.data);
    } catch (error) {
      console.error(`❌ Failed to send message to ${phoneNumber}:`, error.response?.data || error.message);
    }
  };

  // Send messages in parallel using Promise.all()
  await Promise.all(contacts.map(sendMessage));

  console.log("✅ All messages processed.");
};
// messaging_product: "whatsapp",
//         to: phoneNumber,
//         type: "template",
//         template: {
//           name: "hello_world",
//           language: {
//             code: "en_US",
//           },
//         },