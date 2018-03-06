const config = require('./../config.json');
const prefix = config.commandPrefix;
const search = require('./search.js');
const checker = require('./checker.js');
const queuelist = require('./queue.js');
const youtuberesolver = require('./youtuberesolver.js');
const WolkeStream = require('./WolkeStream.js');
const Discord = require("discord.js");
module.exports = function(client) {
  class musiccontroller {
    constructor(client) {
      this.client = client;
      this.connection = [];
      this.autoLeaveTimeout = [];
      this.isplaying = [];
      this.configfristtime = [];
    };

    async addsong(msg, song) {
      let guildid = msg.guild.id;
      if (!this.isplaying[guildid]) {
        this.isplaying[guildid] = false;
      };
      if (song) {
        queuelist.add(msg, song);
        msg.channel.send("``" + song.title + "`` เพื่มลงในคิวแล้ว.").then(calmsg => {
          calmsg.delete(10000);
        });
        if (!this.isplaying[guildid]) {
          await this.voicejoin(msg);
          this.isplaying[guildid] = true;
          this.play(msg, this.connection[guildid].connection, queuelist.list[guildid]['song'][0]);
        };
      } else {
        if (!queuelist.list[guildid]['song'][0]) {
          this.isplaying[guildid] = false;
          return;
        };
        this.play(msg, this.connection[guildid].connection, queuelist.list[guildid]['song'][0]);
      };
    };

    async voicejoin(msg) {
      let guildid = msg.guild.id;
      await msg.member.voiceChannel.join()
        .then(bitconnect => {
          this.connection[guildid] = {
            connection: bitconnect
          };
          return bitconnect;
        }).catch(console.log);
    };

    async skip(msg) {
      let guildid = msg.guild.id;
      try {
        msg.channel.send('skip').then(calmsg => {
          calmsg.delete(10000);
        });
      } catch (e) {
        console.log(e);
      };
      this.connection[guildid].end();
    };

    /**
     * Plays a Song
     * @param {msg} msg - discord message
     * @param {connection} - voice connection
     * @param {Song} Song - the song to play
     */
    async play(msg, connection, Song) {
      let guildid = msg.guild.id;
      this.isplaying[guildid] = true;
      clearTimeout(this.autoLeaveTimeout[guildid]);
      let options = {
        volume: 0.2
      };
      if (connection && Song) {
        let link;
        if (Song.type === 'youtube') {
          if (Song.isOpus) {
            try {
              link = new WolkeStream(Song.streamUrl);
            } catch (e) {
              console.error(e);
              return this.nextSong(Song);
            };
          } else {
            msg.channel.send('ERROR');
            return;
          };
        };
        let dispatcher = connection.playStream(link, options);
        dispatcher.setMaxListeners(20);
        dispatcher.once('end', () => {
          queuelist.removefrist(msg);
          //dispatcher.removeAllListeners();
          setTimeout(() => {
            this.addsong(msg);
          }, 1000);
          this.autoLeaveTimeout[guildid] = setTimeout(() => {
            try {
              this.connection[guildid].connection.disconnect();
            } catch (e) {
              console.error(e);
            };
          }, 1000 * 60 * 1); // 10 Minutes 1000 * 60 * 10
        });
        dispatcher.once('error', (err) => {
          setTimeout(() => {
            this.addsong(msg);
          }, 1000);
        });
      } else {
        console.log('voice error');
        return;
      };
    };

    async fristtime(msg) {
      let guildid = msg.guild.id;
      this.configfristtime[guildid] = true;
      this.isplaying[guildid] = false;
    };
  };

  const controller = new musiccontroller(client);

  client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type != "text") return;
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    if (!command.startsWith(prefix)) return;
    let cmd = command.slice(prefix.length);
    if (cmd === "play") {
      try {
        message.delete();
      } catch (e) {
        console.log(e);
      };
      if (!message.member.voiceChannel) {
        message.reply('คุณต้องเข้าห้อง voice').then(calmsg => {
          calmsg.delete(10000);
        });
        return;
      };
      messageArray.shift();
      let query = messageArray.join(" ");
      if (!query.length) {
        message.reply('กรุณาใส่ข้อความ').then(calmsg => {
          calmsg.delete(10000);
        });
        return;
      };
      let checkvideoid = await checker.check(query);
      if (checkvideoid) {
        let songobj = await youtuberesolver.resolve(message, checkvideoid);
        controller.addsong(message, songobj);
        return;
      } else {
        try {
          search.search(message, query).then(async function(songid) {
            let songobj = await youtuberesolver.resolve(message, songid);
            controller.addsong(message, songobj);
            return;
          }).catch(console.log);
        } catch (e) {
          console.log(e);
        };
      };
    };
    if (cmd === "skip") {
      try {
        message.delete();
      } catch (e) {
        console.log(e);
      };
      let guildid = message.guild.id;
      try {
        controller.connection[guildid].connection.dispatcher.end();
      } catch (e) {
        console.log(e);
      };
      message.reply("กำลังข้าม").then(msg => {
        msg.delete(10000);
      });
    };
    if (cmd === "queue") {
      try {
        message.delete();
      } catch (e) {
        console.log(e);
      };
      try {
        queuelist.showlist(message);
      } catch (e) {
        message.channel.send('ไม่มีเพลงที่กำลังเล่น').then(calmsg => {
          calmsg.delete(10000);
        });
        console.log(e);
        return;
      };
      let queue = queuelist.showlist(message);
      if (queue.length === 0) {
        message.channel.send('ไม่มีเพลงที่กำลังเล่น').then(calmsg => {
          calmsg.delete(10000);
        });
        return;
      };
      let queuelists = "";
      for (var i = 0; i < queue.length; i++) {
        queuelists += `${i + 1}. ` + queue[i].title + "\r\n";
      };
      let chatformat = `กำลังเล่นเพลงตามลำดับ\r\n` + queuelists;
      message.channel.send(chatformat).then(calmsg => {
        calmsg.delete(10000);
      });
    };
  });
};