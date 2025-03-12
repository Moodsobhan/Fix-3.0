const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "pairv3",
    version: "1.1",
    author: "Rulex-al LOUFI (Modified by ChatGPT)",
    shortDescription: {
      en: "Pair up with a mentioned user or a random girl 😗",
      vi: ""
    },
    category: "love",
    guide: "{prefix}pair [mention user]"
  },

  onStart: async function({ event, threadsData, message, usersData }) {
    const uidI = event.senderID;
    const mentions = event.mentions;
    const threadData = await threadsData.get(event.threadID);
    const name1 = await usersData.getName(uidI);
    const avatarUrl1 = await usersData.getAvatarUrl(uidI);

    let uid2, name2, avatarUrl2;

    if (Object.keys(mentions).length > 0) {
      // If a user is mentioned, pair with them
      uid2 = Object.keys(mentions)[0]; // Get first mentioned user
      name2 = await usersData.getName(uid2);
      avatarUrl2 = await usersData.getAvatarUrl(uid2);
    } else {
      // If no mention, pair with a random female from the group
      const members = threadData.members.filter(member => member.gender === "FEMALE" && member.inGroup);
      if (members.length === 0) return message.reply("No eligible girls found in the group! 🥲");

      const randomIndex = Math.floor(Math.random() * members.length);
      const randomMember = members[randomIndex];
      uid2 = randomMember.userID;
      name2 = await usersData.getName(uid2);
      avatarUrl2 = await usersData.getAvatarUrl(uid2);
    }

    const lovePercentage = Math.floor(Math.random() * 36) + 65;
    const compatibilityPercentage = Math.floor(Math.random() * 36) + 65;

    message.reply({
      body: `💞 Everyone, congratulate the new couple! 💞
❤️ ${name1} 💕 ${name2} ❤️
💘 Love Percentage: **${lovePercentage}%**  
💕 Compatibility: **${compatibilityPercentage}%**  

🔥 Best wishes to this lovely couple! 🥳`,
      attachment: [
        await getStreamFromURL(avatarUrl1),
        await getStreamFromURL(avatarUrl2)
      ]
    });
  }
};
