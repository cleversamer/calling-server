const axios = require("axios");
// const binService = require("./bin.service");

const BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"];
const GROUP_CHAT_ID = process.env["TELEGRAM_GROUP_CHAT_ID"];

module.exports.sendMessage = async (message) => {
  try {
    if (!BOT_TOKEN || !GROUP_CHAT_ID) {
      console.log("Telegram bot token or group chat ID not set");
      return;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: GROUP_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.error("Failed to send Telegram message:", err.message);
  }
};
