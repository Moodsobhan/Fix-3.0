module.exports = {
  config: {
    name: "sim",
    version: "1.0",
    author: "Sobhan-prime",
    shortDescription: "Toggles auto-reply on/off",
    category: "AutoReply",
    guide: "{p}sim on  |  {p}sim off"
  },

  // The onStart handler toggles auto-reply mode.
  onStart: async function({ event, api, args }) {
    const toggle = args[0] ? args[0].toLowerCase() : "";
    if (toggle === "on") {
      global.autoReplySim = true;
      return api.sendMessage("Auto-reply is now ON.", event.threadID);
    } else if (toggle === "off") {
      global.autoReplySim = false;
      return api.sendMessage("Auto-reply is now OFF.", event.threadID);
    } else {
      return api.sendMessage("Usage: sim on  OR  sim off", event.threadID);
    }
  },

  // The onChat handler auto-replies to every message when enabled.
  onChat: async function({ event, message }) {
    try {
      if (!global.autoReplySim) return;  // Only reply if auto-reply is enabled.
      if (event.senderID === global.botID) return; // Avoid self-reply loops.

      const prefix = global.config.PREFIX || "";  
      const msgText = event.body ? event.body.toLowerCase().trim() : "";
      if (msgText.startsWith(prefix + "sim")) return; // Ignore sim commands

      // Check conditions and reply accordingly.
      if (msgText.includes("asalamualikum")) {
        message.reply("walikumasalam");
      } else if (msgText.includes("kemon aso")) {
        message.reply("kono moto baicha asi bot er jibon 6h pore pore off hoiya jai");
      } else if (msgText.includes("kire shayan koi")) {
        message.reply("Shayan hagte gase mama!!!!");
      } else {
        message.reply("Sim, I am here!");
      }
    }
    catch (error) {
      console.error("Error in auto-reply onChat:", error);
    }
  }
};
