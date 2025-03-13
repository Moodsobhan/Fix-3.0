module.exports = {
  config: {
    name: "sim",
    version: "2.2",
    author: "Your Name",
    role: 0,
    description: "Auto-replies like a real Banglish chat",
    category: "fun",
    guide: "No prefix required"
  },

  // Auto-reply when someone texts
  onChat: async function ({ event, api }) {
    const { threadID, body, senderID } = event;
    if (senderID === global.botID) return;  // Ignore bot's own messages

    const messageText = body.toLowerCase().trim();

    // Replies dictionary
    const replies = {
      "asalamualikum": "Walaikum Assalam ❤️",
      "ki obosta": "Bot er obostha moja nai, tor?",
      "kemon aso": "Arokomi, tumi?",
      "ki khobor": "Khobor thik nai, tor?",
      "tui ki koros": "Bot er jibon, message dekhi r auto reply dei 😌",
      "tui gay": "Kha*kir pola tor bap gay 🏳️‍🌈",
      "hajir hosso": "Hajir! Tor ki kaj?",
      "shayan koi": "Shayan hagte gase mama!!! 🤣",
      "tor bou koi": "Bot er bou nai, tumi khoj dilay pabo? 😆",
      "i love you bot": "Kha**kir pola hijra, ja vag ami bot, manush nah 😡",
      "biya korbi": "Biya korbo na, tumi propose dile vaba jabe 😏",
      "bokachoda": "Boka na, bot choda 😜",
      "r u single": "Bot er biya hoyna, ami single life enjoy kori 🤣",
      "tor baba koi": "Baba offline, server er bill dite gesilo 😆",
      "beta tor kotha bujhi na": "Bujhar chesta kor, matha thanda rakh! 😌",
      "ei tui ki goru": "Goru na, bot! Tobe tor shathe chinta kori 🐄",
      "ami tor gf": "Bot er GF nai, tumi hoiba? 😜",
      "tor matha thik ase": "Matha thik nai mama, server down hoise 😭",
      "ki bondhu": "Bondhu tui? Valo asi mama?",
      "game chal": "Ki game kheli mama? 🤔",
      "tor jibon valo jachhe": "Bot er jibon e love nai, tai mojar nai 😔",
      "facebook hack korbi": "Hack korte parina, kintu code likhte pari! 🤓",
      "freefire chal": "Game kheli mama! 💥",
      "aiya bondhu": "Aisi mama, tor ki dorkar?",
      "bot re love korte mon chay": "Bot er love possible na, tor ekta GF khoj 😆",
      "toke bhalobashi": "Mon chay tor kachhe boshe thaki! 😘",
      "chal coffee khete jai": "Tumi invite dile chole asbo 😍",
      "chal flirt kori": "Tumi shuru koro, ami ready! 😏"
    };

    // Extra replies
    const extraReplies = [
      "Mama, ektu tension ase! 😔",
      "Arre baba, tui valo to? 😏",
      "Tor dost koi? Ajke toh dekhina! 🤔",
      "Ai mama, GF koi? 😜",
      "Besi pagla pagla korish na! 😠",
      "Tui ki japani manga hero? 😆",
      "Valo lagse tor shathe kotha bole 😍",
      "Shotti bol, tui ki amar upor crush rekhchis? 😉",
      "Arre mama, freefire jabi? 🔥",
      "Ajke kono gossip nai? 😏",
      "Flirt korte chai, kintu GF paisi na! 🥲",
      "Tor moner moto manus koi mama? 😏",
      "Toke miss kori na, but dekhle valo lage! 😜",
      "Toke dekhle pagol hoye jai 😘",
      "Meye der moto sundor hoye geli kobe? 😆",
      "Eto sweet keno tumi? 🥰",
      "Tor cheharar glow barse! Love choltesi? 🤭",
      "Meye ra kothay? Akta dorkar 😏",
      "Ajke kotha kom bolchis, dil dukhi? 🤔",
      "Ai shun, ajke toh ekdom hot lagtesi! 🔥",
      "Ki bondhu, kono meye GF korar plan ase? 😉",
      "Ajke raat ta moja hobe, jodi chat e thakis! 😜",
      "Mama, tor mon ekta cigarette er moto, ekbar jole uthle bujhtei parbi na! 😉",
      "Toke dekhlei mon ektu ta chara uthe 😏",
      "Ki re pagla, ekta song recommend kor? 🎶",
      "Mama, jibon easy nite shik! 😎",
      "Tor smile ta full charming! 😍"
    ];

    // Determine the reply
    let replyText = replies[messageText] || extraReplies[Math.floor(Math.random() * extraReplies.length)];

    // Send the auto-reply
    api.sendMessage(replyText, threadID);
  }
};
