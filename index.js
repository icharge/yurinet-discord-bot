/*
    Yurinet-discord-bot
    The token of your bot - https://discordapp.com/developers/applications/me
    Please Config the config.json
*/

/* process.on('uncaughtException', (ex) => {
  console.error('Error uncaughtException : ', ex);
});

process.on('unhandledRejection', (ex) => {
  console.error('Error uncaughtException :', ex);
}); */

const leaveFn = () => {
  if (voiceChannelRoom) {
    if (voiceChannelRoom.connection) {
      voiceChannelRoom.connection.disconnect();
    }
    voiceChannelRoom.leave();
  }
  if (client) {
    client.destroy();
  }
};

process.on('SIGINT', () => {
  console.log('SIGINT received');
  leaveFn();
});

process.on('SIGKILL', () => {
  console.log('SIGKILL received');
  leaveFn();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  leaveFn();
});

// Import REPL for prompt
const repl = require('repl');
// Import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client({
  autoReconnect: true,
});
// Import config
let config = require('./config.json');
let prefix = config.commandPrefix;

let chatLogRoom;

/**
 * @type {Discord.VoiceChannel}
 */
let voiceChannelRoom;

// Import Music controller
const musicControllerSrc = require('./modules/musiccontroller');

/**
 * @type {musicControllerSrc}
 */
let musicController;
// Import Time Module
const datetime = require("./modules/dateNtime");
// embed
let yurinet, ddraw, game;
yurinet = new Discord.RichEmbed();
ddraw = new Discord.RichEmbed();
game = new Discord.RichEmbed();

//bot
client.on('guildMemberAdd', async (member) => {
  console.log(`${member} Has join ${member.guild.name} server.`);
});

client.once('ready', () => {
  console.log('Im ready!');
  client.user.setActivity("ENERMY", {
    type: "LISTENING"
  });
  var replServer = repl.start({
    prompt: 'YuriBot > ',
  });
  replServer.context.client = client;

  chatLogRoom = client.channels.get(config.chatlogidroom);
  voiceChannelRoom = client.channels.get(config.voiceChannelId);
  musicController = new musicControllerSrc(voiceChannelRoom);

  yurinet.setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#EE82EE")
    .addField("Download",
      "http://play.thaira2.com/download/yn0910_setup.exe")
    .addField("เล่นออน์ไลน์ ด้วย yurinet",
      "ติดตั้งโปรแกรม สมัคร ตั้งค่า แล้วไปลุยกันได้เลย")
    .setFooter("**แมว");
  game.setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#EE82EE")
    .addField("Download",
      "http://www.thaira2.com/download.html")
    .addField("ตัวเกม red alert 2 yuri revenge",
      "เลือก link โหลดตัวเกมเพียง link เดี่ยว")
    .setFooter("**แมว");
  ddraw.setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#EE82EE")
    .addField("Download",
      "ดูได้ที่ห้อง <#340534866116608000>"
    )
    .addField("แก้อาการกระตุก หรือ มองไม่เห็นเมนู",
      "โหลด DDRAW.DLL แล้วนำไฟล์ไปลงที่แฟ้มเกมลงแบบเหมือนลงม็อดเกม Yuri"
    )
    .addField("DDRAW ที่แนะนำ",
      "DDrawCompat หรือ narzoul ddraw"
    )
    .setFooter("**ถ้าไม่ทำงานแสดงว่าคุณลงผิดที่ ลองลงใหม่");
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== "text") return;
  const messageArray = message.content.split(/\s+/g);
  if (!messageArray[0].startsWith(prefix)) return;
  let cmd = messageArray[0].slice(prefix.length).toLowerCase();
  if (cmd === "ddraw") {
    message.channel.send({
      embed: ddraw
    });
  } else if (cmd === "yurinet") {
    message.channel.send({
      embed: yurinet
    });
  } else if (cmd === "game") {
    message.channel.send({
      embed: game
    });
  } else if (cmd === "play") {
    message.delete();
    messageArray.shift();
    let query = messageArray.join(" ");
    musicController.asksong(message, query);
  } else if (cmd === "queue") {
    message.delete();
    musicController.checkafkbot(message);
    musicController.showqueue(message);
  } else if (cmd === "stop") {
    message.delete();
    musicController.checkafkbot(message);
    musicController.stop(message);
  } else if (cmd === "skip") {
    message.delete();
    musicController.checkafkbot(message);
    musicController.skip(message);
  }
  return;
});

//Game chat
console.log('socket.io-client is running');
const io = require('socket.io-client');
const socket = io(config.socketioserver, {
  reconnect: true
});
socket.on('connect', () => {
  console.log('socket.io-client is connected!');
});
let lastChat = {};
socket.on('lobby.chat', async (response) => {
  let ChatDate = datetime(response.timestamp);
  let ChatForm = '``' + response.name + '``' + " : " + response.message;
  let formatChatMessage = '``' + ChatDate + "`` " + ChatForm;
  let chatconsolelog = `${ChatDate} ${response.name} : ${response.message}`;

  if (lastChat[response.name] === response.message) {
    //console.log('spam');
    return;
  }
  Object.defineProperty(lastChat, response.name, {
    value: response.message,
    writable: true,
    configurable: true
  });
  chatlog.send(formatChatMessage);
  console.log(chatconsolelog);
});
socket.on('disconnect', () => {
  console.log('socket.io-client is disconnected!');
});

try {
  client.login(config.token);
} catch (e) {
  console.log(e);
}