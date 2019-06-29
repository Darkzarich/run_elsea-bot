const grabber = require('../services/grabber.js')
const parser = require('./parser.js')

const Discord = require('discord.js');
const client = new Discord.Client();
const token = JSON.parse(JSON.stringify(require('./token.json')));

client.on('message', msg => {
  if (msg.content === 'ping') {
  	msg.channel.send("Loading...").then( msgLoading => {
	    grabber.initDriver().then( driver => {
	    	grabber.grab(driver, parser.DEFAULT_COMMAND).then( ldata => {
	    		driver.close();
	    		const attachment = new Discord.Attachment(new Buffer(ldata, 'base64'));
	    		let embed = new Discord.RichEmbed({attachments: attachment})
	    			.setColor('#0099ff')
	    			.setTitle('Some title')

	    		msgLoading.edit("", embed)
	    	}).catch( e => {
	    		console.log('Grab: ' + e)
	    	})
	    }).catch( e => {
	    	console.log('Init driver: ' + e)
	    })
	})
  }
})

client.login(token.TOKEN)