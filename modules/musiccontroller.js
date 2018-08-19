const Discord = require('discord.js');
const queue = require("./queue.js");
const WolkeStream = require("./WolkeStream.js");
const youtuberesolver = require("./youtuberesolver");
const search = require("./search.js");
const checker = require("./checker.js");
const EventEmitter = require('eventemitter3');
class MusicController extends EventEmitter {

  /**
   * @param {Discord.VoiceChannel} voiceChannel 
   */
  constructor(voiceChannel) {
    super();

    /**
     * @type {{[guildId: string]: Discord.VoiceConnection}}
     */
    this.connection;

    this.connection = {};
    this.autoLeaveTimeout = [];
    this.isplaying = {};
    this.voiceChannel = voiceChannel;
  }
  async addsong(msg, song) {
    this.cleartime(msg);
    let guildid = msg.guild.id;
    if (!this.isplaying[guildid]) {
      this.isplaying[guildid] = false;
    }
    if (song) {
      console.log(`${msg.guild.name}|${msg.member.displayName}|${msg.author.id} requested song ${song.title}`);
      queue.add(msg, song);
      msg.channel.send("``" + song.title + "`` เพื่มลงในคิวแล้ว.").then(calmsg => {
        calmsg.delete(10000);
      });
      if (!this.isplaying[guildid]) {
        this.isplaying[guildid] = true;
        this.play(msg, this.connection[guildid], queue.list[guildid]["song"][0]);
      }
    } else {
      if (!queue.list[guildid]["song"][0]) {
        this.isplaying[guildid] = false;
        this.settime(msg);
        return;
      }
      this.play(msg, this.connection[guildid], queue.list[guildid]["song"][0]);
    }
  }

  /**
   * Play song on Discord Voice channel
   * 
   * @param {Discord.Message} msg Message from user
   * @param {Discord.VoiceConnection} connection Current Voice connection
   * @param {*} Song Song to play
   */
  async play(msg, connection, Song) {
    let options = {
      volume: 0.25,
      seek: 0
    };
    if (connection && Song) {
      let Wolke;
      if (Song.type === "youtube") {
        try {
          // Wolke = new WolkeStream(Song.streamUrl);
          // TODO: Change in yt class later
          Wolke = require('ytdl-core')(Song.url, {/*  filter: 'audioonly', */ quality: 'highest' });
        } catch (e) {
          console.error(e);
          console.log("error wolkestream");
          setTimeout(() => {
            this.addsong(msg);
          }, 1000);
          return;
        }
      } else {
        msg.channel.send("ERROR");
        return;
      }
      const dispatcher = connection.playStream(Wolke, options)
        .setMaxListeners(20)
        .on('start', () => console.log('StreamDispatcher Started'))
        .on("end", (reason) => {
          // Wolke.output.end();
          console.log('StreamDispatcher ended reason: ' + reason);
          queue.removefrist(msg);
          setTimeout(() => {
            this.addsong(msg);
          }, 1000);
        })
        .on("error", (err) => {
          // Wolke.output.end();

          setTimeout(() => {
            this.addsong(msg);
          }, 1000);
          console.log(err);
          console.log("Do we still have internet? | dispatcher error");
        })
        .on('debug', info => console.log('StreamDispatcher Debug : ' + info));
    } else {
      setTimeout(() => {
        this.addsong(msg);
      }, 1000);
      return;
    }
  }

  async cleartime(msg) {
    let guildid = msg.guild.id;
    clearTimeout(this.autoLeaveTimeout[guildid]);
  }

  async settime(msg) {
    let guildid = msg.guild.id;
    this.autoLeaveTimeout[guildid] = setTimeout(() => {
      try {
        this.connection[guildid].disconnect();
        this.isplaying[guildid] = false;
      } catch (e) {
        //console.error(e);
      }
    }, 1000 * 60 * 1); // 10 Minutes 1000 * 60 * 10
  }

  async checkafkbot(msg) {
    let guildid = msg.guild.id;
    if (!this.isplaying[guildid]) {
      this.cleartime(msg);
      this.settime(msg);
    }
  }

  async stop(msg) {
    let guildid = msg.guild.id;
    queue.clearlist(msg);
    console.log(`${msg.guild.name}|${msg.author.id} call stop music`);
    try {
      this.connection[guildid].dispatcher.end();
    } catch (e) {
      //console.log(e);
    }
    msg.channel.send("หยุดเล่นแล้ว").then(calmsg => {
      calmsg.delete(10000);
    }).catch(() => { });
  }

  async showqueue(msg) {
    try {
      queue.showlist(msg);
    } catch (e) {
      msg.channel.send("ไม่มีเพลงที่กำลังเล่น").then(calmsg => {
        calmsg.delete(10000);
      }).catch(() => { });
      return;
    }
    let queuelist = queue.showlist(msg);
    if (queuelist.length === 0) {
      msg.channel.send("ไม่มีเพลงที่กำลังเล่น").then(calmsg => {
        calmsg.delete(10000);
      }).catch(() => { });
      return;
    }
    let queuelists = "";
    for (var i = 0; i < queuelist.length; i++) {
      queuelists += `${i + 1}. ` + queuelist[i].title + "\r\n";
    }
    let chatformat = "กำลังเล่นเพลงตามลำดับ\r\n" + queuelists;
    msg.channel.send(chatformat).then(calmsg => {
      calmsg.delete(10000);
    }).catch(() => { });
    return;
  }
  async skip(msg) {
    let guildid = msg.guild.id;
    msg.reply("กำลังข้าม").then(calmsg => {
      calmsg.delete(10000);
    }).catch(() => { });
    console.log(`${msg.guild.name}|${msg.author.id} call skip music`);
    try {
      this.connection[guildid].dispatcher.end();
    } catch (e) {
      // console.log(e);
    }
    this.addsong(msg);
  }

  /**
   * 
   * @param {Discord.Message} msg Message from user
   * @param {string} query 
   */
  async asksong(msg, query) {
    this.cleartime(msg);
    const voiceChannel = this.voiceChannel || msg.member.voiceChannel;
    if (voiceChannel) {
      voiceChannel.join().then(bitconnect => this.connection[msg.guild.id] = bitconnect);
    } else {
      msg.reply("คุณต้องเข้าห้อง voice").then(calmsg => {
        calmsg.delete(10000);
      }).catch(() => { });
      this.checkafkbot(msg);
      return;
    }
    if (!query.length) {
      msg.reply("กรุณาใส่ข้อความ").then(calmsg => {
        calmsg.delete(10000);
      }).catch(() => { });
      this.checkafkbot(msg);
      return;
    }
    let checkvideoid = await checker.check(query);
    if (checkvideoid) {
      youtuberesolver.resolve(msg, checkvideoid).then(songobj => {
        this.addsong(msg, songobj);
      }).catch(function (rej) {
        console.log(rej);
      });
      return;
    } else {
      try {
        let songid = await search.search(msg, query);
        if (!songid) {
          this.checkafkbot(msg);
          return;
        }
        youtuberesolver.resolve(msg, songid).then(songobj => {
          this.addsong(msg, songobj);
        }).catch(rej => {
          console.log(rej);
        });
        return;
      } catch (e) {
        console.log(e);
      }
    }
    return;
  }
}
module.exports = MusicController;