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
  invite();
});

try {
  client.login(config.token);
} catch (e) {
  console.log(e.stack)
}

let detectword = ['กระตุก', 'แลค', 'จอดำ', 'ออนไลน์', 'ค้าง', 'DDwrapper'];
let DDwrapper = ['กระตุก', 'แลค', 'ค้าง', 'DDwrapper', 'เมนู']
let yurinet = ['yurinet', 'ออนไลน์', 'online']
let game = ['game', 'ตัวเกม', 'เกม', 'yuri']
let black_screen = ['จอดำ', 'black_screen']
client.on('message', async message => {
  if (message.author.bot) return
  console.log('message = ' + message)
  let messageArray = message.content.split(/\s+/g);
  console.log('messageArray = ' + messageArray)
  let command = messageArray[0];
  console.log('messageArray[0] = ' + messageArray[0])
  console.log('command = ' + command)
  if (command.startsWith(prefix)) {
    let cmd = command.slice(prefix.length);
    console.log(cmd)
    if (cmd === "DDwrapper") {
      let DDwrapperEmbed = new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setColor("#EE82EE")
        .addField("Download",
        "https://drive.google.com/file/d/0B0ELu66No5j9SGpONERnUFFUTHM/view")
        .addField("แก้อาการกระตุก หรือ มองไม่เห็นเมนู",
        "โหลด DDwrapper แล้วนำ 2 ไฟล์ไปลงที่แฟ้มเกมลงแบบเหมือนลงม็อดเกม Yuri")
        .setFooter("**ถ้าไม่ทำงานแสดงว่าคุณลงผิดที่ ลองลงใหม่")
      message.channel.send({
        embed: DDwrapperEmbed
      });
    };
    if (cmd === "yurinet") {
      let yurinetEmbed = new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setColor("#EE82EE")
        .addField("Download",
        "http://play.thaira2.com/download/yn0910_setup.exe")
        .addField("เล่นออน์ไลน์ ด้วย yurinet",
        "ติดตั้งโปรแกรม สมัคร ตั้งค่า แล้วไปลุยกันได้เลย")
        .setFooter("**แมว")
      message.channel.send({
        embed: yurinetEmbed
      });
    };
    if (cmd === "game") {
      let gameEmbed = new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setColor("#EE82EE")
        .addField("Download",
        "http://www.thaira2.com/download.html")
        .addField("ตัวเกม red alert 2 yuri revenge",
        "เลือก link โหลดตัวเกมเพียง link เดี่ยว")
        .setFooter("**แมว")
      message.channel.send({
        embed: gameEmbed
      });
    };
  } else {
    let detected = [];
    let helper = [];
    DDwrapper.forEach(word => {
      if (message.content.indexOf(word) > -1) {
        if (!detected.length) detected.push(word);
        if (!helper.length) helper.push("DDwrapper");
      }
    })
    yurinet.forEach(word => {
      if (message.content.indexOf(word) > -1) {
        if (!detected.length) detected.push(word);
        if (!helper.length) helper.push("yurinet");
      }
    })
    game.forEach(word => {
      if (message.content.indexOf(word) > -1) {
        if (!detected.length) detected.push(word);
        if (!helper.length) helper.push("game");
      }
    })
    if (detected.length == 0) return
    if (message.content.indexOf())
      message.channel.send("เราได้ตรวจพบคำ `" + detected +
        "` ลองพิมพ์ `" + prefix + helper + "`");
  };
});

// Now look at this net
function net() { // that I just found!
  // When I say go,
  // be ready to throw!

  // GO!
  throw net;
} // Throw it on him, not me!
// Urgh, let's try somthing else

function invite() {
  client.generateInvite(['ADMINISTRATOR'])
    .then(link => {
      console.log(`invite link: ${link}`);
    });
}

function DDwrapperMessage() {

}
