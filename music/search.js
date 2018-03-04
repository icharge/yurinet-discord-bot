const config = require('./../config.json');
const yt_api_key = config.youtubeAPI;
let AsciiTable = require('ascii-table')
let axios = require('axios');
const Discord = require("discord.js");
class search {
  constructor(msg, query) {
    this.msg = msg
    this.query = query
  }
  search(msg, query) {
    return new Promise(async (resolve, reject) => {
      await axios({
        url: 'https://www.googleapis.com/youtube/v3/search',
        method: 'get',
        params: {
          part: 'snippet',
          type: 'video',
          maxResults: '10',
          key: yt_api_key,
          order: 'relevance',
          q: query
        }
      }).then(json => {
        let match = json.data
        let count = 0;
        if (json.data.items.length === 0) {
          msg.reply("ไม่เจอ").then(calmsg => {
            calmsg.delete(10000)
            return reject()
          });
        } else {
          var table = new AsciiTable('')
          table
            .setHeading('No.', 'Video Title')
            .removeBorder()
          count = 0
          for (var i = 0; i < json.data.items.length; i++) {
            count++
            table.addRow(count + ".", json.data.items[i].snippet.title)
          }
          msg.reply("\r\n" + table.toString() + "\r\nกรุณาพิมพ์ตัวเลข").then(async searchmsg => {
            const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {
              time: 20000,
              max: 1
            });
            collector.on('end', async collected => {
              searchmsg.delete()
              try {
                collected.first().delete()
                if (!collected.array().length) msg.reply("คุณไม่ได้เลือกเพลง").then(calmsg => {
                  calmsg.delete(10000)
                  return reject()
                })
                if (match.items[collected.first().content - 1] != undefined) {
                  let songid = match.items[collected.first().content - 1].id.videoId;
                  return resolve(songid)
                } else {
                  msg.reply("ใส่ตัวเลขให้ถูกต้อง").then(calmsg => {
                    calmsg.delete(10000)
                  })
                  return reject()
                }
              } catch (e) {
                msg.reply("ใส่ตัวเลขให้ถูกต้อง").then(calmsg => {
                  calmsg.delete(10000)
                })
                console.log(e)
                return reject()
              }
            })
          })
        }
      })
    })
  };
}
module.exports = new search();