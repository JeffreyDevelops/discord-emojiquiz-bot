const { emojiquiz } = require('../db.js');
// You need to require emojiquizContent.
const { emojiquizContent } = require('../utils/messages.js')
module.exports = {
	name: 'messageCreate',
	async execute(message) { 
        emojiquiz.message = message;

        emojiquiz.start();
    }
};