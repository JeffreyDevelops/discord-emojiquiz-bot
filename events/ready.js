const { emojiquizMYSQL } = require('../db.js');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		emojiquizMYSQL.createTable();
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};