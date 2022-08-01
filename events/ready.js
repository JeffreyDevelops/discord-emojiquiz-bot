const { emojiquiz } = require('../db.js');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		emojiquiz.createTable();
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};