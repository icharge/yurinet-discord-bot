/*
    Yurinet-discord-bot
    The token of your bot - https://discordapp.com/developers/applications/me
    Please Config the config.json
*/
// Import REPL for prompt
const repl = require('repl');
// Import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client({
  autoReconnect: true
});
let yurinetEmbed = new Discord.RichEmbed();
let gameEmbed = new Discord.RichEmbed();
let DDwrapperEmbed = new Discord.RichEmbed();

// Import config
let config = require('./config.json');
let prefix = config.commandPrefix;
const chatlog = client.channels.get(config.chatlogidroom);

// Import Music controller
const musiccontrollersrc = require('./musicmodules/musiccontroller');
const musicontroller = new musiccontrollersrc(client, prefix);

// Import Time Module
const datetime = require("./modules/dateNtime")

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

  yurinetEmbed.setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#EE82EE")
    .addField("Download",
      "http://play.thaira2.com/download/yn0910_setup.exe")
    .addField("เล่นออน์ไลน์ ด้วย yurinet",
      "ติดตั้งโปรแกรม สมัคร ตั้งค่า แล้วไปลุยกันได้เลย")
    .setFooter("**แมว");
  gameEmbed.setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#EE82EE")
    .addField("Download",
      "http://www.thaira2.com/download.html")
    .addField("ตัวเกม red alert 2 yuri revenge",
      "เลือก link โหลดตัวเกมเพียง link เดี่ยว")
    .setFooter("**แมว");
  DDwrapperEmbed.setAuthor(client.user.username, client.user.avatarURL)
    .setColor("#EE82EE")
    .addField("Download",
      "ดูได้ที่ห้อง <#340534866116608000>"
    )
    .addField("แก้อาการกระตุก หรือ มองไม่เห็นเมนู",
      "โหลด DDRAW.DLL แล้วนำไฟล์ไปลงที่แฟ้มเกมลงแบบเหมือนลงม็อดเกม Yuri"
    )
    .setFooter("**ถ้าไม่ทำงานแสดงว่าคุณลงผิดที่ ลองลงใหม่");
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== "text") return;
  let messageArray = message.content.split(/\s+/g);
  if (!messageArray[0].startsWith(prefix)) return;
  let cmd = messageArray[0].slice(prefix.length).toLowerCase();
  let cmd = command.slice(prefix.length);
  if (cmd === "ddraw") {
    message.channel.send({
      embed: DDwrapperEmbed
    });
    return;
  };
  if (cmd === "yurinet") {
    message.channel.send({
      embed: yurinetEmbed
    });
    return;
  };
  if (cmd === "game") {
    message.channel.send({
      embed: gameEmbed
    });
    return;
  };

  //music module
  if (cmd === "play") {
    message.delete();
    messageArray.shift();
    let query = messageArray.join(" ");
    musicontroller.asksong(message, query);
    return;
  };
  if (cmd === "queue") {
    message.delete();
    musicontroller.checkafkbot(message);
    musicontroller.showqueue(message);
    return;
  };
  if (cmd === "stop") {
    message.delete();
    musicontroller.checkafkbot(message);
    musicontroller.stop(message);
    return;
  };
  if (cmd === "skip") {
    message.delete();
    musicontroller.checkafkbot(message);
    musicontroller.skip(message);
    return;
  };
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

  function getchatmsg() {
    return '``' + response.name + '``' + " : " + response.message;
  };

  function formatChatMessage() {
    return '``' + ChatDate + "`` " + getchatmsg();
  };

  function printDiscordChatMessage() {
    return `${ChatDate} ${response.name} : ${response.message}`;
  };

  if (lastChat[response.name] === response.message) {
    //console.log('spam');
    return;
  };
  Object.defineProperty(lastChat, response.name, {
    value: response.message,
    writable: true,
    configurable: true
  });
  chatlog.send(formatChatMessage());
  console.log(printDiscordChatMessage());
});
socket.on('disconnect', () => {
  console.log('socket.io-client is disconnected!');
});

try {
  client.login(config.token);
} catch (e) {
  console.log(e);
};