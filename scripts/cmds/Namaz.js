const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "namaz",
    version: "1.1",
    author: "sobhan",
    shortDescription: "Sends a random Quran/Namaz-related video",
    category: "Islamic",
    guide: "{p}namaz"
  },

  onStart: async function({ event, message }) {
    try {
      // List of Namaz/Quran-related video URLs
      const videoLinks = [
        "https://example.com/namaz1.mp4",
        "https://example.com/namaz2.mp4",
        "https://example.com/namaz3.mp4",
        "https://example.com/quran1.mp4",
        "https://example.com/quran2.mp4",
        "https://example.com/quran3.mp4",
        "https://example.com/azan1.mp4",
        "https://example.com/azan2.mp4",
        "https://example.com/azan3.mp4",
        "https://example.com/islamic1.mp4",
        "https://example.com/islamic2.mp4"
      ];

      // Select a random video
      const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];

      // Prepare attachment
      const videoAttachment = await getStreamFromURL(randomVideo);

      // Send video
      message.reply({
        body: "Here is a beautiful video about Namaz/Quran 📖",
        attachment: videoAttachment
      });
    } 
    catch (error) {
      console.error("Error in sending video:", error);
      message.reply("❌ Failed to send video. Please try again later.");
    }
  }
};
