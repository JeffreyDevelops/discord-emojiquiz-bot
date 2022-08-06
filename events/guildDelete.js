const { emojiquiz } = require('../db.js');
module.exports = {
	name: 'guildDelete',
	async execute(guild) { 
        try { 
        let emojiquiz_delete = `DELETE FROM emojiquiz WHERE guildID = ${guild.id}`;
        emojiquiz.connection.query(emojiquiz_delete, function (err, data, result) {
        var row_nod;
        Object.keys(data).forEach(function(key) {
        row_nod = data[key];
        });
        });
        
        } catch (error) {
          return;  
        }
    }
};