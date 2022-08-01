var Database = require('../classes/Database.js');
const db = new Database();
export default class Emojiquiz {

    constructor(guildID, guildName, word, hint, searched_word) {
    this.guildID = guildID;
    this.guildName = guildName;
    this.word = word;
    this.hint = hint;
    this.searched_word = searched_word;
    }


    createEmojiQuiz() {
        let get_emojiquiz = `SELECT * FROM emojiquiz WHERE guildID = ${this.guildID}`;
        db.query(get_emojiquiz, function (err, data, result) {
            var row_nod;
            var config_array = [];
            Object.keys(data).forEach(function(key) {
                row_nod = data[key];
                config_array.push(row_nod.guildID);
        });


        if (config_array.includes(this.guildID === false)) {
            let emojiquiz = [];
            emojiquiz.push({word: this.word, hint: this.hint, searched: this.searched_word});
            let getinfo = `INSERT INTO emojiquiz (guildID, guildName, data) VALUES (${this.guildID}, '${this.guildName}', '${JSON.stringify(emojiquiz)}')`;
            db.query(getinfo, function (err, data, result) {
            }); 
        } else {
            let emojiquiz = JSON.parse(row_nod.data);
            emojiquiz.push({word: this.word, hint: this.hint, searched: this.searched_word});
            let getinfo = `UPDATE emojiquiz SET data = '${JSON.stringify(emojiquiz)}' WHERE guildID = ${this.guildID}`;
            db.query(getinfo, function (err, data, result) {
            });
        }
        
    }); 
    }

}
