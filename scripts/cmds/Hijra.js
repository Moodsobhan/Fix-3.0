const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const DIG = require("discord-image-generation");

module.exports = {
  config: {
    name: "hijrafinder",
    version: "1.2",
    author: "Vex_Kshitiz (Modified by ChatGPT)",
    shortDescription: "Finds a hijra in the group and applies a funny filter 😂",
    category: "Fun",
    guide: "{p}hijrafinder",
  },

  onStart: async function ({ api, event, usersData, message }) {
    try {
      const excludedUserID = "61557052662679"; // Exclude bot itself
      const threadInfo = await api.getThreadInfo(event.threadID);
      const participantIDs = threadInfo.participantIDs.filter(id => id !== event.senderID && id !== excludedUserID);

      if (participantIDs.length === 0) {
        return message.reply("No users found in this group! 🥲");
      }

      // Pick a random user
      const randomIndex = Math.floor(Math.random() * participantIDs.length);
      const randomUserID = participantIDs[randomIndex];
      const userInfo = await api.getUserInfo([randomUserID]);
      const user = userInfo[randomUserID];
      const avatarUrl = await usersData.getAvatarUrl(randomUserID);

      // Apply Hijra (Gay) filter effect
      const hijraFilterImage = await applyHijraFilter(avatarUrl);

      // Send response with image
      message.reply({
        body: `🤣 Look, I found a **Hijra** in the group: ${user.name} 🤭`,
        attachment: fs.createReadStream(hijraFilterImage),
      });

    } catch (error) {
      console.error("Error in hijrafinder command:", error);
      message.reply("Oops! Something went wrong. Try again later.");
    }
  },
};

// Function to apply the "Gay" filter from DIG
async function applyHijraFilter(avatarUrl) {
  const imageResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
  const image = Buffer.from(imageResponse.data, "binary");
  const hijraFilter = new DIG.Gay(); // Using existing "Gay" filter as effect
  const hijraFilterImage = await hijraFilter.getImage(image);

  // Save the processed image
  const outputFile = path.join(__dirname, "cache", `hijra.png`);
  fs.writeFileSync(outputFile, hijraFilterImage);

  return outputFile;
    }
