const grabber = require('../services/grabber.js')
const CALC_DEFAULT_COMMANDS = require('../data/default_command.js')
const Discord = require('discord.js');

const embedBorderColor = '#63bbab'
const embedBorderErrorColor = '#FF0000'

const ping = {
	meta: {
		help: "Just for fun",
		command: "ping",
		alias: ['hey'],
		arguments: []
	},
	fn: function (msg, args) {
		msg.reply("Pong !")
	}
}

const tokenGetCalculation = {
	meta: {
		help: "This command calcules time needed to reach a certain amount of tokens using aidoru.info calculator",
		command: "token",
		alias: ['tok', 'calculate', 'calc']
	},
	fn: function (msg, args)  {

		let mutableDefualCommands = CALC_DEFAULT_COMMANDS;

	  	msg.channel.send("Loading...").then( msgLoading => {
		    grabber.initDriver().then( driver => {
		    	grabber.grab(driver, mutableDefualCommands).then( ldata => {
		    		driver.quit();
		    		// let embed = new Discord.RichEmbed()
		    		// 	.setColor(embedBorderColor)
		    		// 	.setTitle('Your results: ')
		    		// 	.attachFile(Buffer.from(ldata, 'base64'))
		    		msgLoading.delete();
		    		msg.reply('Your results:', {file: Buffer.from(ldata, 'base64')})
		    	}).catch( e => {
		    		driver.quit();
		    		if (e.error) {
		    			let embed = new Discord.RichEmbed()
		    				.setColor(embedBorderErrorColor)
		    				.setTitle('Error')
		    				.setDescription(e.error)
		    			if (e.file) {
		    				embed.attachFile(Buffer.from(e.file, 'base64'))
		    			}
		    			msgLoading.delete();
		    			msg.channel.send(embed)
		    		} else {
		    			msgLoading.edit('Grab: ' + e)
		    		}
		    	})
		    }).catch( e => {
		    	console.log('Init driver: ' + e)
		    })
		})
	} ,
}

const help = {
	meta: {
		help: "This command shows required arguments and info about a command",
		command: "help",
		alias: ["support", "what"],
	},
	fn: function (msg, args) {

	}
}


module.exports = [
	tokenGetCalculation,
	help,
	ping
]