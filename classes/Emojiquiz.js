var mysql = require("mysql");
const { EmbedBuilder } = require('discord.js');
module.exports = class Emojiquiz {

    constructor(host, user, password, database, charset, guildID, guildName, word, hint, searched_word, interaction) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
    this.charset = charset;
    this.connection = this.connection;
    this.guildID = guildID;
    this.guildName = guildName;
    this.word = word;
    this.hint = hint;
    this.searched_word = searched_word;
    this.interaction = interaction;
    }

    #createConnection() {
        this.connection = mysql.createPool({
              host: this.host,
              user: this.user,
              password: this.password,
              database: this.database,
              charset: this.charset
          });
      }   
  
      createTable() {
          this.#createConnection();
          // Create database
          const query = "CREATE TABLE IF NOT EXISTS emojiquiz (guildID BIGINT(20), guildName VARCHAR(255), channelID BIGINT(20), emojiMsgID BIGINT(20), bulkDeleteCounter BIGINT(20), data longtext, PRIMARY KEY (guildID))";
          this.connection.query(query, function (err, result) {
              if (err) {
                  console.log("Something went wrong check your database details.");
                  return;
              }
              console.log("Successfully created emojiquiz table!");
            });
      }


    createEmojiQuiz() {
        let get_connection = this.connection;
        let get_interaction = this.interaction;
        let get_guildID = this.guildID;
        let get_guildName = this.guildName;
        let get_word = this.word;
        let get_hint = this.hint;
        let get_searched_word = this.searched_word;
        let get_emojiquiz = `SELECT * FROM emojiquiz WHERE guildID = ${this.guildID}`;
        get_connection.query(get_emojiquiz, function (err, data, result) {
            var row_nod;
            var config_array = [];
            Object.keys(data).forEach(function(key) {
                row_nod = data[key];
                config_array.push(row_nod.guildID);
        });

        const make_a = async function() {
        const emoji_embed = new EmbedBuilder()
        .setTitle('**Emojiquiz**')
        .setDescription(`If you have any issues to solve that emojiquiz then you can click the buttons to get some help.`)
        .addFields(
            { name: '❓Searched word', value: get_word, inline: true},
            { name: '❗Hint', value: get_hint, inline: true },
        )
        .setColor('#FFFFFF')
        .setFooter({ text: 'Assistance ~ solved the last emojiquiz! 😄', iconURL: `https://imgur.com/WbMHZqB.png` });
        try {
            await get_interaction.reply({content: `That's how it will look like!\nIf you need to change something do **/emojiquiz-delete**\nSearched word: **${get_searched_word}**`, embeds: [emoji_embed], ephemeral: true});   
                if (config_array.includes(parseInt(get_guildID)) === false) {
                    let emojiquiz = [];
                    emojiquiz.push({word: get_word, hint: get_hint, searched: get_searched_word});
                    let getinfo = `INSERT INTO emojiquiz (guildID, guildName, data) VALUES (${get_guildID}, '${get_guildName}', '${JSON.stringify(emojiquiz)}')`;
                    get_connection.query(getinfo, function (err, data, result) {
                    });  
                } else {
                    let get_emojiquiz2 = `SELECT * FROM emojiquiz WHERE ${get_guildID}`;
                    get_connection.query(get_emojiquiz2, function (err, data, result) {
                    var row_nod2;
                    Object.keys(data).forEach(function(key) {
                    row_nod2 = data[key];
                    });
                    let emojiquiz = JSON.parse(row_nod2.data);
                    emojiquiz.push({word: get_word, hint: get_hint, searched: get_searched_word});
                    let getinfo = `UPDATE emojiquiz SET data = '${JSON.stringify(emojiquiz)}' WHERE guildID = ${get_guildID}`;
                    get_connection.query(getinfo, function (err, data, result) {
                    }); 
                }); 
                }
            } catch (error) {
             return;     
            }           
        }
        make_a();
    });
}    
}
