/*
  A bot that welcomes new guild members when they join
*/
// The token of your bot - https://discordapp.com/developers/applications/me
// Please Config the config.json

// Import config
let config;
try { config = require('./config.json'); 
} catch (e) {
	console.log(e.stack) 
}
const prefix = config.commandPrefix;

// Import REPL for prompt
const repl = require('repl');

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to the guilds default channel (usually #general), mentioning the member
  member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);

  // If you want to send the message to a designated channel on a server instead
  // you can do the following:
  const channel = member.guild.channels.find('name', 'chat-logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

client.on('ready', () => {
  console.log('Im ready!');

  const myGuild = client.guilds.find('id', config.owner_server);
  myGuild.defaultChannel.send('Hi there !.  ^___^');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.channel.send('อังกอ!');
  }
});

// Log our bot in
client.login(config.token);

var replServer = repl.start({
  prompt: 'YuriBot > ',
});

replServer.context.client = client;

// Now look at this net
function net() { // that I just found!
    // When I say go,
    // be ready to throw!

    // GO!
    throw net;
}// Throw it on him, not me!
// Urgh, let's try somthing else