module.exports = {
  config: {
    name: "seen",
    version: "1.0",
    author: "sobhan",
    shortDescription: "Auto-seen messages when enabled",
    category: "Utility",
    guide: "{p}seen on  |  {p}seen off"
  },

  // Toggle auto-seen ON/OFF using prefix command
  onStart: async function({ event, api, args }) {
    const toggle = args[0] ? args[0].toLowerCase() : "";
    if (toggle === "on") {
      global.autoSeen = true;
      return api.sendMessage("✅ Auto-seen is now ON.", event.threadID);
    } else if (toggle === "off") {
      global.autoSeen = false;
      return api.sendMessage("❌ Auto-seen is now OFF.", event.threadID);
    } else {
      return api.sendMessage("Usage: seen on  |  seen off", event.threadID);
    }
  },

  // Auto-seen messages when enabled
  onChat: async function({ event, api }) {
    try {
      if (!global.autoSeen) return; // Only mark as seen if enabled
      if (event.senderID === global.botID) return; // Ignore bot messages

      // Mark the message as seen
      api.markAsRead(event.threadID, (err) => {
        if (err) console.error("Error marking message as seen:", err);
      });
    } 
    catch (error) {
      console.error("Error in auto-seen onChat:", error);
    }
  }
};
