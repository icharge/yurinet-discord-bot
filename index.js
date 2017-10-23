/*
    Yurinet-discord-bot
    The token of your bot - https://discordapp.com/developers/applications/me
    Please Config the config.json
*/
// Import REPL for prompt
const repl = require('repl');
// Import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client();
// Import config
let config = require('./config.json');
let prefix = config.commandPrefix;
//bot
client.on('guildMemberAdd', member => {
  console.log(`${member} Has join ${member.guild.name} server.`);
});

client.on('ready', () => {
  console.log('Im ready!');
  var replServer = repl.start({
    prompt: 'YuriBot > ',
  });
  replServer.context.client = client;
});

try {
  client.login(config.token);
} catch (e) {
  console.log(e.stack)
}

client.on('message', async message => {
  if (message.author.bot) return
  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  if (command.startsWith(prefix)) {
    let yurinetEmbed = new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor("#EE82EE")
      .addField("Download",
        "http://play.thaira2.com/download/yn0910_setup.exe")
      .addField("เล่นออน์ไลน์ ด้วย yurinet",
        "ติดตั้งโปรแกรม สมัคร ตั้งค่า แล้วไปลุยกันได้เลย")
      .setFooter("**แมว")
    let gameEmbed = new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor("#EE82EE")
      .addField("Download",
        "http://www.thaira2.com/download.html")
      .addField("ตัวเกม red alert 2 yuri revenge",
        "เลือก link โหลดตัวเกมเพียง link เดี่ยว")
      .setFooter("**แมว")
    let DDwrapperEmbed = new Discord.RichEmbed()
      .setAuthor(client.user.username, client.user.avatarURL)
      .setColor("#EE82EE")
      .addField("Download",
        "https://drive.google.com/file/d/0B0ELu66No5j9SGpONERnUFFUTHM/view"
      )
      .addField("แก้อาการกระตุก หรือ มองไม่เห็นเมนู",
        "โหลด DDwrapper แล้วนำ 2 ไฟล์ไปลงที่แฟ้มเกมลงแบบเหมือนลงม็อดเกม Yuri"
      )
      .setFooter("**ถ้าไม่ทำงานแสดงว่าคุณลงผิดที่ ลองลงใหม่")
    let cmd = command.slice(prefix.length);
    if (cmd === "DDraw") {
      message.channel.send({
        embed: DDwrapperEmbed
      });
    };
    if (cmd === "yurinet") {
      message.channel.send({
        embed: yurinetEmbed
      });
    };
    if (cmd === "game") {
      message.channel.send({
        embed: gameEmbed
      });
    };
  }
})

//Game chat
console.log('socket.io-client is running');
const io = require('socket.io-client')
const socket = io(config.socketioserver, {
  reconnect: true
});
socket.on('connect', function(socket) {
  console.log('socket.io-client is connected!');
});
let lastchat = {}
socket.on('lobby.chat', function(response) {
  const chatlog = client.channels.get(config.chatlogidroom);
  let chatdetail = new Date(response.timestamp);
  let tempchatdate = chatdetail.getDate();
  let tempchatmonth = chatdetail.getMonth() + 1;
  let chatyear = chatdetail.getFullYear();
  let tempchathours = chatdetail.getHours();
  let tempchatminutes = chatdetail.getMinutes();
  let tempchatseconds = chatdetail.getSeconds();
  let chatdate = (tempchatdate < 10) ? `0${tempchatdate}` : tempchatdate
  let chatmonth = (tempchatmonth < 10) ? `0${tempchatmonth}` :
    tempchatmonth
  let chathours = (tempchathours < 10) ? `0${tempchathours}` :
    tempchathours
  let chatminutes = (tempchatminutes < 10) ? `0${tempchatminutes}` :
    tempchatminutes
  let chatseconds = (tempchatseconds < 10) ? `0${tempchatseconds}` :
    tempchatseconds

  function getchatdaze() {
    return chatdate + "/" + chatmonth + "/" + chatyear
  }

  function getchatintime() {
    return chathours + ":" + chatminutes + ":" + chatseconds
  }

  function getchatmsg() {
    return '``' + response.name + '``' + " : " + response.message
  }

  function getchatformatdiscord() {
    return '``' + getchatdaze() + " " + getchatintime() + "`` " +
      getchatmsg()
  }

  function getchatformat() {
    return getchatdaze() + " " + getchatintime() + " " + response.name +
      " : " + response.message
  }
  if (lastchat[response.name] === response.message) {
    console.log('spam')
    return
  }
  Object.defineProperty(lastchat, response.name, {
      value: response.message,
      writable: true,
      configurable: true
    })
    //  console.log(lastchat)
  chatlog.send(getchatformatdiscord())
    //  console.log(response)
  console.log(getchatformat())
});
socket.on('disconnect', function() {
  console.log('socket.io-client is disconnected!');
});
