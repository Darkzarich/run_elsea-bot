const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('./commands')
//const token = JSON.parse(JSON.stringify(require('./token.json')));
const token = process.env.TOKEN;

client.on('ready', () => {
	console.log("The bot is serving...")
})

client.on('message', msg => {
	try {
		if(msg.author.bot || !msg.isMentioned(client.user)) return;

		const command = msg.content.trim().replace(Discord.MessageMentions.USERS_PATTERN, "")
		                .trim().split(" ")[0].toLowerCase()
		const args = msg.content.split(" ").slice[1]

		console.log("command: ", command)
		console.log("args: ", args)
		console.log("msg: ", msg.content)
		console.log("replace", msg.content.replace(Discord.MessageMentions.USERS_PATTERN, ""))

		if (!command) {
			msg.reply("Hi")
			return;
		}

		const func = commands.find( func => func.meta.command.includes(command) || 
					           func.meta.alias.includes(command)) 
		if (func) {
			func.fn(msg, args)
		} else {
			msg.reply("You typed an invalid command")
		}
	} catch (e) {
		console.log("Critical Error: ", e)
	}
})

client.login(token.TOKEN)