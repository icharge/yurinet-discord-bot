/*
  A bot that welcomes new guild members when they join
*/

// Import REPL for prompt
const repl = require('repl');

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzQwOTE0ODA2MTcxMzY5NDg1.DIhExg.7eeEGCKE0xpwqTR4i7EqRkdx8CU';

// /**
//  * @type {"discord.js".Guild}
//  */
// var myGuild;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

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

  const myGuild = client.guilds.find('id', '340528463704358912');
  myGuild.defaultChannel.send('Hi there !.  ^___^');
});

// Log our bot in
client.login(token);

var replServer = repl.start({
  prompt: 'YuriBot > ',
});

replServer.context.client = client;
