const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "punch",
    version: "1.2",
    author: "Your Name",
    role: 0,
    description: "Punch a tagged user with their face on a meme!",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ event, api }) {
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
      return api.sendMessage("Mention someone to punch! 👊", event.threadID);
    }

    const mentionID = Object.keys(event.mentions)[0];

    try {
      // Download the mentioned user's profile picture
      const profilePicURL = `https://graph.facebook.com/${mentionID}/picture?width=200&height=200`;
      const profilePicPath = __dirname + "/cache/avatar.png";
      const punchImagePath = __dirname + "/cache/punch.png";

      const response = await axios.get(profilePicURL, { responseType: "arraybuffer" });
      fs.writeFileSync(profilePicPath, response.data);

      // Load images
      const baseImage = await loadImage("punch_template.jpg"); // Replace with actual punch meme
      const userAvatar = await loadImage(profilePicPath);

      // Create a new canvas
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw base punch meme
      ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);

      // Draw user's face on the victim's position (adjust values as needed)
      ctx.drawImage(userAvatar, 250, 80, 120, 120); // Adjust x, y, width, height

      // Save the edited image
      const buffer = canvas.toBuffer();
      fs.writeFileSync(punchImagePath, buffer);

      // Send the final image
      api.sendMessage({
        body: `😂 BOOM! ${event.mentions[mentionID]} just got PUNCHED!`,
        mentions: [{ tag: event.mentions[mentionID], id: mentionID }],
        attachment: fs.createReadStream(punchImagePath)
      }, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error processing the image!", event.threadID);
    }
  }
};
