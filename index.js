/*
    Yurinet-discord-bot
    The token of your bot - https://discordapp.com/developers/applications/me
    Please Config the config.json
*/
// Import REPL for prompt
let repl = require('repl');
// Import the discord.js module
let Discord = require('discord.js');
const client = new Discord.Client();
// Import config
let config;
try {
	config = require('./config.json');
} catch (e) {
	console.error(e.stack);
}
const prefix = config.commandPrefix;
const myGuild = client.guilds.find('id', config.owner_server);
// Import command

// No command yet

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

client.on('message', message => {
	if (message.content === 'ping') {
		message.channel.send('pong');
	}
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
