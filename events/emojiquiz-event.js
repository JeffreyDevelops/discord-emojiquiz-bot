const { emojiquiz } = require('../db.js');
module.exports = {
	name: 'messageCreate',
	async execute(message) { 
        emojiquiz.message = message;

        emojiquiz.start();
    }
};