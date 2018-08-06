const config = require("./../config.json");
const yt_api_key = config.youtubeAPI;
let axios = require("axios");
const Discord = require("discord.js");
class search {
    constructor(msg, query) {
        this.msg = msg;
        this.query = query;
    }
    search(msg, query) {
        return new Promise(async (resolve, reject) => {
            let json = await axios({
                url: "https://www.googleapis.com/youtube/v3/search",
                method: "get",
                params: {
                    part: "snippet",
                    type: "video",
                    maxResults: "10",
                    key: yt_api_key,
                    order: "relevance",
                    q: query,
                    regionCode: "TH",
                    relevanceLanguage: "ja",
                    safeSearch: "none"
                }
            });
            let match = json.data;
            let count = 0;
            if (json.data.items.length === 0) {
                msg.reply("ไม่เจอ").then(async calmsg => {
                    calmsg.delete(10000);
                    return reject();
                });
            } else {
                var table = "No. - title\r\n";
                for (var i = 0; i < json.data.items.length; i++) {
                    count++;
                    table += count + ". " + json.data.items[i].snippet.title + "\r\n";
                }
                msg.reply("\r\n" + table + `\r\nกรุณาพิมพ์ตัวเลขอย่างเดี่ยวเช่น "1"`).then(async searchmsg => {
                    const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {
                        time: 20000,
                        max: 1
                    });
                    collector.on("end", async collected => {
                        searchmsg.delete();
                        try {
                            collected.first().delete();
                            if (match.items[collected.first().content - 1] != undefined) {
                                let songid = match.items[collected.first().content - 1].id.videoId;
                                return resolve(songid);
                            } else {
                                msg.reply("ใส่ตัวเลขให้ถูกต้อง").then(async calmsg => {
                                    calmsg.delete(10000);
                                });
                                return resolve();
                            }
                        } catch (e) {
                            if (!collected.array().length) msg.reply("คุณไม่ได้เลือกเพลง").then(async calmsg => {
                                calmsg.delete(10000);
                                return resolve();
                            });
                        }
                    });
                });
            }
        });
    }
}
module.exports = new search();