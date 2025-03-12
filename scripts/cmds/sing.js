const axios = require("axios");
const fs = require("fs-extra");
const { getStreamFromURL } = global.utils;

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "sing",
    version: "1.14",
    aliases: ["song", "music", "play"],
    author: "dipto",
    countDown: 5,
    role: 0,
    description: {
      en: "Download audio from YouTube"
    },
    category: "media",
    guide: {
      en: "{pn} [<song name>|<song link>]: use to download audio from YouTube" + "\n   Example:"
         + "\n{pn} chipi chipi chapa chapa"
    }
  },
  langs: {
    en: {
      error: "❌ An error occurred: %1",
      noResult: "⭕ No search results match the keyword %1",
      choose: "%1Reply to the message with a number to choose or any content to cancel",
      audio: "audio",
      noAudio: "⭕ Sorry, no audio was found with a size less than 26MB"
    }
  },
  onStart: async function ({ args, message, event, commandName, getLang }) {
    // Regex to check for valid YouTube URL.
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const isUrl = checkurl.test(args[0]);

    if (isUrl) {
      // Extract the video ID from the URL.
      const videoIdMatch = args[0].match(checkurl);
      const idvideo = videoIdMatch[1];

      // Download audio directly from the video.
      const response = await axios.get(`${await baseApiUrl()}/ytdl?songID=${idvideo}`);
      const desiredFormat = response.data.adaptiveFormats.find(
        format => format.mimeType.includes("audio/webm") && format.audioQuality === "AUDIO_QUALITY_LOW"
      ) || response.data.adaptiveFormats.find(
        format => format.mimeType.includes("audio/webm") && format.audioQuality === "AUDIO_QUALITY_MEDIUM"
      );
      if (!desiredFormat) return message.reply(getLang("noAudio"));
      const title = response.data.title;
      const vid = desiredFormat.url;
      const savePath = `${__dirname}/assests/${idvideo}_${Date.now()}.mp3`;
      const writer = fs.createWriteStream(savePath);

      // Unsending the previous prompt if any.
      await message.unsend(event.messageID);

      const responseStream = await axios({
        url: vid,
        method: 'GET',
        responseType: 'stream'
      });
      responseStream.data.pipe(writer);
      writer.on('finish', () => {
        message.reply({
          body: title,
          attachment: fs.createReadStream(savePath)
        }, (err) => {
          if (err) return message.reply(getLang("error", err.message));
          fs.unlinkSync(savePath);
        });
      });
      writer.on('error', (err) => {
        fs.unlinkSync(savePath);
        return message.reply(getLang("error", err.message));
      });
      return;
    }

    // If not a valid URL, treat the input as a search query.
    let keyWord = args.join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;
    let result;
    try {
      result = (await search(keyWord)).slice(0, maxResults);
    } catch (err) {
      return message.reply(getLang("error", err.message));
    }
    if (result.length === 0) return message.reply(getLang("noResult", keyWord));

    let msg = "";
    let i = 1;
    const thumbnails = [];
    for (const info of result) {
      thumbnails.push(getStreamFromURL(info.thumbnail));
      msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }
    message.reply({
      body: getLang("choose", msg),
      attachment: await Promise.all(thumbnails)
    }, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        author: event.senderID,
        result
      });
    });
  },
  onReply: async ({ event, api, Reply, message, getLang }) => {
    const { result } = Reply;
    const choice = parseInt(event.body);
    if (!isNaN(choice) && choice <= result.length && choice > 0) {
      const infoChoice = result[choice - 1];
      const idvideo = infoChoice.id;
      const response = await axios.get(`${await baseApiUrl()}/ytdl?songID=${idvideo}`);
      const desiredFormat = response.data.adaptiveFormats.find(
        format => format.mimeType.includes("audio/webm") && format.audioQuality === "AUDIO_QUALITY_LOW"
      ) || response.data.adaptiveFormats.find(
        format => format.mimeType.includes("audio/webm") && format.audioQuality === "AUDIO_QUALITY_MEDIUM"
      );
      if (!desiredFormat) return message.reply(getLang("noAudio"));
      const title = response.data.title;
      const vid = desiredFormat.url;
      const savePath = `${__dirname}/assests/${idvideo}_${Date.now()}.mp3`;
      const writer = fs.createWriteStream(savePath);

      await message.unsend(Reply.messageID);

      const responseStream = await axios({
        url: vid,
        method: 'GET',
        responseType: 'stream'
      });
      responseStream.data.pipe(writer);
      writer.on('finish', () => {
        message.reply({
          body: title,
          attachment: fs.createReadStream(savePath)
        }, (err) => {
          if (err) return message.reply(getLang("error", err.message));
          fs.unlinkSync(savePath);
        });
      });
      writer.on('error', (err) => {
        fs.unlinkSync(savePath);
        return message.reply(getLang("error", err.message));
      });
    } else {
      message.reply("Invalid choice. Please enter a number between 1 and 6.");
    }
  }
};

async function search(keyWord) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`;
    const res = await axios.get(url);
    const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
    const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    const results = [];
    for (const video of videos) {
      if (video.videoRenderer?.lengthText?.simpleText) {
        results.push({
          id: video.videoRenderer.videoId,
          title: video.videoRenderer.title.runs[0].text,
          thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
          time: video.videoRenderer.lengthText.simpleText,
          channel: {
            name: video.videoRenderer.ownerText.runs[0].text
          }
        });
      }
    }
    return results;
  } catch (e) {
    const error = new Error("Cannot search video");
    error.code = "SEARCH_VIDEO_ERROR";
    throw error;
  }
}

// You may implement getVideoInfo here if needed later.
async function getVideoInfo(url) {
  // To be implemented later if required.
      }
