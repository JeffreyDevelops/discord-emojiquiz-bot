const { emojiquiz } = require('../db.js');
module.exports = {
	name: 'interactionCreate',
	async execute(interaction) { 
        emojiquiz.button = interaction;
        emojiquiz.skip();
        emojiquiz.firstLetter();
    }
};