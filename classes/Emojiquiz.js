var mysql = require("mysql");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
module.exports = class Emojiquiz {

    constructor(host, user, password, database, charset, guildID, guildName, word, hint, searched_word, interaction, channel, message) {
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
    this.channel = channel;
    this.message = message;
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
  
      ready() {
        this.#createConnection()
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

    setup() {
        let get_connection = this.connection;
        let get_interaction = this.interaction;
        let get_guildID = this.guildID;
        let get_guildName = this.guildName;
        let get_channel = this.channel;
        const emojiquiz_btns = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Skip word')
            .setCustomId('skip_word')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏩'),
            new ButtonBuilder()
            .setLabel('First Letter')
            .setCustomId('first_letter')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⚡'),
            new ButtonBuilder()
            .setLabel('Suggest new quiz')
            .setCustomId('suggest_new_quiz')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🤳'),
    );          
                let get_emojiquiz = `SELECT * FROM emojiquiz WHERE guildID = ${this.guildID}`;
                this.connection.query(get_emojiquiz, function (err, data, result) {
                    var row_nod;
                    var config_array = [];
                    Object.keys(data).forEach(function(key) {
                        row_nod = data[key];
                        config_array.push(row_nod.guildID);
                });
                const make_a = async function() {
                if (config_array.includes(parseInt(get_guildID)) === true) {
                    let emojiquiz = JSON.parse(row_nod.data);
                    function shuffle(a) {
                        var j, x, i;
                        for (i = a.length - 1; i > 0; i--) {
                            j = Math.floor(Math.random() * (i + 1));
                            x = a[i];
                            a[i] = a[j];
                            a[j] = x;
                        }
                        return a;
                    }
                    shuffle(emojiquiz);
    
                const emoji_embed = new EmbedBuilder()
                .setTitle('**Emojiquiz**')
                .setDescription('If you have any issues to solve that emojiquiz then you can click the buttons to get some help.')
                .addFields(
                { name: '❓Searched word', value: emojiquiz[0].word, inline: true},
                { name: '❗Hint', value: emojiquiz[0].hint, inline: true },
                )
                .setColor('#FFFFFF')
                .setFooter({ text: 'Assistance ~ solved the last emojiquiz! 😄', iconURL: `https://imgur.com/WbMHZqB.png` });
                
                    try {
                        await get_interaction.reply({content: `Successfully setuped emojiquiz. <:Jeezy:1003070707950944378>`, ephemeral: true})
                        let emojiquiz_send = await get_channel.send({embeds: [emoji_embed], components: [emojiquiz_btns]});   
                        let getinfo = `UPDATE emojiquiz SET guildID = ${get_guildID}, guildName = '${get_guildName}', channelID = ${get_channel.id}, emojiMsgID = ${emojiquiz_send.id} WHERE guildID = ${get_guildID}`;
                        get_connection.query(getinfo, function (err, data, result) {
                        });  
                    } catch (error) {
                     return;       
                    }           
                
                } 
                else {
                    const embed = new EmbedBuilder()
                    .setColor('#FFFFFF')
                    .setDescription(`You need to do **/emojiquiz-create** first before you can setup the emojiquiz. 😀`);
                        try {
                            await get_interaction.reply({embeds: [embed], ephemeral: true});   
                        } catch (error) {
                            return;
                        }   
                }
            }
            make_a();
            });
}
    start() {
        let get_connection = this.connection;
        let get_message = this.message;
        const emojiquiz_btns = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Skip word')
            .setCustomId('skip_word')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏩'),
            new ButtonBuilder()
            .setLabel('First Letter')
            .setCustomId('first_letter')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⚡'),
            new ButtonBuilder()
            .setLabel('Suggest new quiz')
            .setCustomId('suggest_new_quiz')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🤳'),
    );          
        let get_emojiquiz = `SELECT * FROM emojiquiz WHERE guildID = ${get_message.guildId}`;
        this.connection.query(get_emojiquiz, function (err, data, result) {
        var row_nod;
		var config_array = [];
        Object.keys(data).forEach(function(key) {
        row_nod = data[key];
		config_array.push(row_nod.guildID);
        });
		let get_message_content = get_message;
		if (get_message.author.bot === true) return;
		if (config_array.includes(parseInt(get_message.guildId)) === false) return;
		let emojiquiz_channel = row_nod.channelID;
		if (emojiquiz_channel === parseInt(get_message.channelId)) {
			let getinfo = `UPDATE emojiquiz SET bulkDeleteCounter = ${row_nod.bulkDeleteCounter + 1} WHERE guildID = ${get_message.guildId}`;
            get_connection.query(getinfo, function (err, data, result) {
            }); 
			let get_searched_word = JSON.parse(row_nod.data);
			if (get_searched_word[0].searched.toLowerCase() === get_message.content.toLowerCase()) {
			get_message_content.react('<a:JeezyCheckmark:1004023251829276824>');
			let get_emojiquiz2 = `SELECT * FROM emojiquiz WHERE ${get_message.guildId}`;
            get_connection.query(get_emojiquiz2, function (err, data, result) {
				var row_nod2;
				Object.keys(data).forEach(function(key) {
					row_nod2 = data[key];
			});	
			const make_a = async function() {
			try {
				await get_message.channel.bulkDelete(row_nod2.bulkDeleteCounter + 2);
				let getinfo = `UPDATE emojiquiz SET bulkDeleteCounter = 0 WHERE guildID = ${get_message.guildId}`;
				get_connection.query(getinfo, function (err, data, result) {
				}); 
                    let emojiquiz = JSON.parse(row_nod.data);
                    function shuffle(a) {
                        var j, x, i;
                        for (i = a.length - 1; i > 0; i--) {
                            j = Math.floor(Math.random() * (i + 1));
                            x = a[i];
                            a[i] = a[j];
                            a[j] = x;
                        }
                        return a;
                    }
                    shuffle(emojiquiz);
    
                const emoji_embed = new EmbedBuilder()
                .setTitle('**Emojiquiz**')
                .setDescription('If you have any issues to solve that emojiquiz then you can click the buttons to get some help.')
                .addFields(
                { name: '❓Searched word', value: emojiquiz[0].word, inline: true},
                { name: '❗Hint', value: emojiquiz[0].hint, inline: true },
                )
                .setColor('#FFFFFF')
                .setFooter({ text: 'Assistance ~ solved the last emojiquiz! 😄', iconURL: `https://imgur.com/WbMHZqB.png` });
                let emojiquiz_send = await get_message.channel.send({embeds: [emoji_embed], components: [emojiquiz_btns]});
			
            let getinfos = `UPDATE emojiquiz SET guildID = ${get_message.guildId}, guildName = '${get_message.guild.name}', channelID = ${get_message.channel.id}, emojiMsgID = ${emojiquiz_send.id} WHERE guildID = ${get_message.guildId}`;
            get_connection.query(getinfos, function (err, data, result) {
            }); 
        } catch (error) {
            return;
            } 
        }
        make_a();
		});
			} else {
				get_message_content.react('<a:JeezyX:1004023250302533662>');
			}
		}

	});
    }


}
