const { emojiquiz } = require('../db.js');
const { ActivityType } = require('discord.js');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		emojiquiz.ready();
		setInterval(() => {
		const arr = ['Coded by Jeezy#1111', 'JeezyDevelopment package', 'discord-emojiquiz'];
		let shuffledNumbers = arr.sort(function () {
			return Math.random() - 0.5;
		  });
		
		client.user.setPresence({ activities: [{ type: ActivityType.Listening, name: shuffledNumbers[0] }], status: 'online' });
	}, 60000);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};