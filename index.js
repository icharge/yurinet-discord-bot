/*
    Yurinet-discord-bot
    The token of your bot - https://discordapp.com/developers/applications/me
    Please Config the config.json
*/
// Import REPL for prompt
try { const repl = require('repl');
} catch (e) {
	console.log(e.stack);
}

// Import the discord.js module
try { const Discord = require('discord.js');
} catch (e) {
	console.log(e.stack);
}

// Import config
let config;
try { config = require('./config.json'); 
} catch (e) {
	console.log(e.stack) 
}
const prefix = config.commandPrefix;

// Import command


// Create an instance of a Discord client
const client = new Discord.Client();

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to the guilds default channel (usually #general), mentioning the member
  member.guild.defaultChannel.send(`Welcome to the ${member.guild.name} server, ${member}!`);

  // If you want to send the message to a designated channel on a server instead
  // you can do the following:
  const channel = member.guild.channels.find('name', 'chat-logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the ${member.guild.name} server, ${member}`);
});

client.on('ready', () => {
  console.log('Im ready!');

  const myGuild = client.guilds.find('id', config.owner_server);
  myGuild.defaultChannel.send('Hi there !.  ^___^');
});

// Log our bot in
try { client.login(config.token);
} catch (e) {
	console.log(e.stack)
}

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

/*
function invite() {
	client.generateInvite(['ADMINISTRATOR'])
  .then(link => {
    console.log(`Generated bot invite link: ${link}`);
  });
}
client.on('message', message => {
	if (message.content === '...invite') {
    invite();
	message.channel.send('Look in console for invite link');
	}});
*/