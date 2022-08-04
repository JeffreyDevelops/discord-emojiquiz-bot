var mysql = require("mysql");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { inlineCode, codeBlock } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { emojiquizContent } = require('./EmojiquizContent.js');
module.exports = class Emojiquiz {
    constructor(host, user, password, database, charset, bigNumbers, guildID, guildName, word, hint, searched_word, interaction, pending_channel, channel, message, button) {
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
    this.pending_channel = pending_channel;
    this.message = message;
    this.button = button;
    this.bigNumbers = bigNumbers;
    }

    #createConnection() {
        this.connection = mysql.createPool({
              host: this.host,
              user: this.user,
              password: this.password,
              database: this.database,
              charset: this.charset,
              supportBigNumbers: this.bigNumbers
          });
      }   
  
      ready() {
        this.#createConnection()
          // Create database
          const query = "CREATE TABLE IF NOT EXISTS emojiquiz (guildID BIGINT(20), guildName VARCHAR(255), pendingChannelID BIGINT(20), channelID BIGINT(20), currentEmoji VARCHAR(255), emojiMsgID BIGINT(20), bulkDeleteCounter BIGINT(20), pendingData longtext, data longtext, PRIMARY KEY (guildID))";
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
        let get_data = JSON.parse(row_nod.data);
        
        let find_duplicate = get_data.find(e => e.word === get_word || e.searched === get_searched_word);
        if (find_duplicate !== undefined) {
            try {
                const make_a = async function() {
                    await get_interaction.reply({content: emojiquizContent.alreadyExist.create_new_quiz_text, ephemeral: true});  
                }
                make_a();
            } catch (error) {
                return;
            }
            return;
        }    
        const make_a = async function() {
        const emoji_embed = new EmbedBuilder()
        .setTitle(`${emojiquizContent.title}`)
        .setDescription(`${emojiquizContent.description}`)
        .addFields(
            { name: `${emojiquizContent.fields.first}`, value: get_word, inline: true},
            { name: `${emojiquizContent.fields.second}`, value: get_hint, inline: true },
        )
        .setColor(`${emojiquizContent.color}`)
        .setFooter({ text: `${emojiquizContent.footer.text}`, iconURL: `${emojiquizContent.footer.iconURL}` });
        try {
            await get_interaction.reply({content: `${emojiquizContent.solution} **${get_searched_word}**`, embeds: [emoji_embed], ephemeral: true});   
                if (config_array.includes(get_guildID) === false) {
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
        let get_channel = this.channel;
        let get_pending_channel = this.pending_channel;
        const emojiquiz_btns = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.skip.label)
            .setCustomId('skip_word')
            .setStyle(emojiquizContent.buttons.skip.style)
            .setEmoji(emojiquizContent.buttons.skip.emoji),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.first_letter.label)
            .setCustomId('first_letter')
            .setStyle(emojiquizContent.buttons.first_letter.style)
            .setEmoji(emojiquizContent.buttons.first_letter.emoji),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.suggest_new_quiz.label)
            .setCustomId('suggest_new_quiz')
            .setStyle(emojiquizContent.buttons.suggest_new_quiz.style)
            .setEmoji(emojiquizContent.buttons.suggest_new_quiz.emoji),
    );          
                let get_emojiquiz = `SELECT * FROM emojiquiz WHERE guildID = ${get_interaction.guildId}`;
                this.connection.query(get_emojiquiz, function (err, data, result) {
                    var row_nod;
                    var config_array = [];
                    Object.keys(data).forEach(function(key) {
                        row_nod = data[key];
                        config_array.push(row_nod.guildID);
                });
                const make_a = async function() {
                if (config_array.includes(get_interaction.guildId) === true) {
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
                .setTitle(`${emojiquizContent.title}`)
                .setDescription(`${emojiquizContent.description}`)
                .addFields(
                { name: `${emojiquizContent.fields.first}`, value: emojiquiz[0].word, inline: true},
                { name: `${emojiquizContent.fields.second}`, value: emojiquiz[0].hint, inline: true },
                )
                .setColor(`${emojiquizContent.color}`)
                .setFooter({ text: `${emojiquizContent.footer.text}`, iconURL: `${emojiquizContent.footer.iconURL}` });
                
                    try {
                        await get_interaction.reply({content: `Successfully setuped emojiquiz. <:Jeezy:1003070707950944378>`, ephemeral: true})
                        let emojiquiz_send = await get_channel.send({embeds: [emoji_embed], components: [emojiquiz_btns]});   
                        let getinfo = `UPDATE emojiquiz SET guildID = ${get_interaction.guildId}, guildName = '${get_interaction.member.guild.name}', pendingChannelID = ${get_pending_channel.id}, channelID = ${get_channel.id}, currentEmoji = '${emojiquiz[0].word}', emojiMsgID = ${emojiquiz_send.id} WHERE guildID = ${get_interaction.guildId}`;
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
            .setLabel(emojiquizContent.buttons.skip.label)
            .setCustomId('skip_word')
            .setStyle(emojiquizContent.buttons.skip.style)
            .setEmoji(emojiquizContent.buttons.skip.emoji),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.first_letter.label)
            .setCustomId('first_letter')
            .setStyle(emojiquizContent.buttons.first_letter.style)
            .setEmoji(emojiquizContent.buttons.first_letter.emoji),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.suggest_new_quiz.label)
            .setCustomId('suggest_new_quiz')
            .setStyle(emojiquizContent.buttons.suggest_new_quiz.style)
            .setEmoji(emojiquizContent.buttons.suggest_new_quiz.emoji),
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
		if (config_array.includes(get_message.guildId) === false) return;
		let emojiquiz_channel = row_nod.channelID;
		if (emojiquiz_channel === get_message.channelId) {
			let getinfo = `UPDATE emojiquiz SET bulkDeleteCounter = ${row_nod.bulkDeleteCounter + 1} WHERE guildID = ${get_message.guildId}`;
            get_connection.query(getinfo, function (err, data, result) {
            }); 
			let get_searched_word = JSON.parse(row_nod.data);
            let get_current_emoji = row_nod.currentEmoji;
            let new_get_searched_word = get_searched_word.find(e => e.word === get_current_emoji);
			if (new_get_searched_word.searched.toLowerCase() === get_message.content.toLowerCase()) {
			get_message_content.react(emojiquizContent.word_reaction.right_word);
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
                .setTitle(`${emojiquizContent.title}`)
                .setDescription(`${emojiquizContent.description}`)
                .addFields(
                { name: `${emojiquizContent.fields.first}`, value: emojiquiz[0].word, inline: true},
                { name: `${emojiquizContent.fields.second}`, value: emojiquiz[0].hint, inline: true },
                )
                .setColor(`${emojiquizContent.color}`)
                .setFooter({ text: `${get_message.author.tag} ${emojiquizContent.footer.textonstart}`, iconURL: `https://cdn.discordapp.com/avatars/${get_message.author.id}/${get_message.author.avatar}.png?size=256`});
                let emojiquiz_send = await get_message.channel.send({embeds: [emoji_embed], components: [emojiquiz_btns]});
			
            let getinfos = `UPDATE emojiquiz SET guildID = ${get_message.guildId}, guildName = '${get_message.guild.name}', channelID = ${get_message.channel.id}, currentEmoji = '${emojiquiz[0].word}', emojiMsgID = ${emojiquiz_send.id} WHERE guildID = ${get_message.guildId}`;
            get_connection.query(getinfos, function (err, data, result) {
            }); 
        } catch (error) {
            return;
            } 
        }
        make_a();
		});
			} else {
				get_message_content.react(emojiquizContent.word_reaction.wrong_word);
			}
		}

	});
    }

    skip() {
        let get_button = this.button;
        let get_connection = this.connection;
        const emojiquiz_btns = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.skip.label)
            .setCustomId('skip_word')
            .setStyle(emojiquizContent.buttons.skip.style)
            .setEmoji(emojiquizContent.buttons.skip.emoji),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.first_letter.label)
            .setCustomId('first_letter')
            .setStyle(emojiquizContent.buttons.first_letter.style)
            .setEmoji(emojiquizContent.buttons.first_letter.emoji),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.suggest_new_quiz.label)
            .setCustomId('suggest_new_quiz')
            .setStyle(emojiquizContent.buttons.suggest_new_quiz.style)
            .setEmoji(emojiquizContent.buttons.suggest_new_quiz.emoji),
    );     
        if (get_button.isButton()) {
        if (get_button.customId === 'skip_word') {
            let get_emojiquiz = `SELECT * FROM emojiquiz WHERE ${get_button.guildId}`;
            get_connection.query(get_emojiquiz, function (err, data, result) {
			var row_nod;
			Object.keys(data).forEach(function(key) {
			row_nod = data[key];
			});	
            const make_a = async function() {
                try {
                await get_button.channel.bulkDelete(row_nod.bulkDeleteCounter + 2);
				let getinfo = `UPDATE emojiquiz SET bulkDeleteCounter = 0 WHERE guildID = ${get_button.guildId}`;
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
                        .setTitle(emojiquizContent.title)
                        .setDescription(emojiquizContent.description)
                        .addFields(
                        { name: emojiquizContent.fields.first, value: emojiquiz[0].word, inline: true},
                        { name: emojiquizContent.fields.second, value: emojiquiz[0].hint, inline: true },
                        )
                        .setColor(emojiquizContent.color)
                        .setFooter({ text: `${get_button.user.tag} ${emojiquizContent.footer.skip_text}`, iconURL: `https://cdn.discordapp.com/avatars/${get_button.user.id}/${get_button.user.avatar}.png?size=256`});
                        let emojiquiz_send = await get_button.channel.send({embeds: [emoji_embed], components: [emojiquiz_btns]});
                        let getinfos = `UPDATE emojiquiz SET guildID = ${get_button.guildId}, guildName = '${get_button.member.guild.name}', currentEmoji = '${emojiquiz[0].word}', emojiMsgID = ${emojiquiz_send.id} WHERE guildID = ${get_button.guildId}`;
                        get_connection.query(getinfos, function (err, data, result) {
                    }); 
                
                } catch (error) {
                    return;
                }
                }
                make_a(); 
                  
                });
                
            }
        }
    }

    firstLetter() {
        let get_button = this.button;
        if (get_button.isButton()) {
        if (this.button.customId === 'first_letter') {
        let get_emojiquiz = `SELECT * FROM emojiquiz WHERE ${this.button.guildId}`;
            this.connection.query(get_emojiquiz, function (err, data, result) {
			var row_nod;
			Object.keys(data).forEach(function(key) {
			row_nod = data[key];
			});	
            const make_a = async function() {
            try {
            let emojiquiz_data = JSON.parse(row_nod.data);
            let emojiquiz_currentEmoji = row_nod.currentEmoji;
            let searched_result = emojiquiz_data.find(e => e.word === emojiquiz_currentEmoji);
            await get_button.reply({content: `${emojiquizContent.first_letter_text} **${searched_result.searched[0]}**.`, ephemeral: true});    
                } catch (error) {
                   return; 
                }
            }
            make_a();
        });
    }
}
}


    #suggest_new_quiz_moderation() {
        const emojiquiz_moderation_btns = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.emojiquiz_decline.label)
            .setCustomId('emojiquiz_decline')
            .setStyle(emojiquizContent.buttons.emojiquiz_decline.style),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.emojiquiz_accept.label)
            .setCustomId('emojiquiz_accept')
            .setStyle(emojiquizContent.buttons.emojiquiz_accept.style)     
    );       
        let get_button = this.button;
        let get_connection = this.connection;
        if (this.button.customId === 'emojiquiz_accept') {
            const make_a = async function() {
                let get_emojiquiz2 = `SELECT * FROM emojiquiz WHERE ${get_button.guildId}`;
                      get_connection.query(get_emojiquiz2, function (err, data, result) {
                      var row_nod;
                      Object.keys(data).forEach(function(key) {
                      row_nod = data[key];
                      });
                      let get_pending_data = JSON.parse(row_nod.pendingData);
                      let get_current_data = JSON.parse(row_nod.data);
                      let get_new_data = get_pending_data.find(e => e.word === get_button.message.embeds[0].data.fields[0].value);
                      let filtered = get_pending_data.filter(function(el) { return el.word != get_button.message.embeds[0].data.fields[0].value }); 
                      get_current_data.push(get_new_data);
                      let getinfo = `UPDATE emojiquiz SET pendingData = '${JSON.stringify(filtered)}', data = '${JSON.stringify(get_current_data)}' WHERE guildID = ${get_button.guildId}`;
                            get_connection.query(getinfo, function (err, data, result) {
                        });
                        const make_a = async function() {
                            try {
                                emojiquiz_moderation_btns.components[0].setDisabled(true);
                                emojiquiz_moderation_btns.components[1].setDisabled(true);
                                let get_msg = await get_button.member.guild.channels.cache.get(get_button.message.channelId).messages.fetch(get_button.message.id);
                                const embed = new EmbedBuilder(get_msg.embeds[0].fields).addFields(
                                {name: get_msg.embeds[0].fields[0].name, value: get_msg.embeds[0].fields[0].value, inline: true},
                                {name: get_msg.embeds[0].fields[1].name, value: get_msg.embeds[0].fields[1].value, inline: true},
                                {name: emojiquizContent.moderation_status.accept_text, value: emojiquizContent.moderation_status.accept_status, inline: false})
                                .setTitle(emojiquizContent.title)
                                .setDescription(emojiquizContent.description)
                                .setColor(emojiquizContent.moderation_status.accept_color)
                                .setFooter({ text: `${get_button.user.tag}`, iconURL: `https://cdn.discordapp.com/avatars/${get_button.user.id}/${get_button.user.avatar}.png?size=256`});
                                
                                await get_button.deferUpdate()
                                await get_button.editReply({embeds: [embed], components: [emojiquiz_moderation_btns] });
                                await get_button.followUp({content: `You successfully accepted **${get_button.message.embeds[0].data.footer.text}** emojiquiz suggestion. ✅`, ephemeral: true});   
                            } catch (error) {
                                return;
                            }
                        }
                        make_a();
                    });
                
            }
            make_a();
        } 
        else if (get_button.customId === 'emojiquiz_decline') {
            const make_a = async function() {
                let get_emojiquiz2 = `SELECT * FROM emojiquiz WHERE ${get_button.guildId}`;
                      get_connection.query(get_emojiquiz2, function (err, data, result) {
                      var row_nod;
                      Object.keys(data).forEach(function(key) {
                      row_nod = data[key];
                      });
                      let get_pending_data = JSON.parse(row_nod.pendingData);
                      let filtered = get_pending_data.filter(function(el) { return el.word != get_button.message.embeds[0].data.fields[0].value }); 
                      let getinfo = `UPDATE emojiquiz SET pendingData = '${JSON.stringify(filtered)}' WHERE guildID = ${get_button.guildId}`;
                            get_connection.query(getinfo, function (err, data, result) {
                        });
                        const make_a = async function() {
                            try {
                            emojiquiz_moderation_btns.components[0].setDisabled(true);
                            emojiquiz_moderation_btns.components[1].setDisabled(true);
                            let get_msg = await get_button.member.guild.channels.cache.get(get_button.message.channelId).messages.fetch(get_button.message.id);
                            const embed = new EmbedBuilder(get_msg.embeds[0].fields).addFields(
                                {name: get_msg.embeds[0].fields[0].name, value: get_msg.embeds[0].fields[0].value, inline: true},
                                {name: get_msg.embeds[0].fields[1].name, value: get_msg.embeds[0].fields[1].value, inline: true},
                                {name: emojiquizContent.moderation_status.decline_text, value: emojiquizContent.moderation_status.decline_status, inline: false})
                                .setTitle(emojiquizContent.title)
                                .setDescription(emojiquizContent.description)
                                .setColor(emojiquizContent.moderation_status.decline_color)
                                .setFooter({ text: `${get_button.user.tag}`, iconURL: `https://cdn.discordapp.com/avatars/${get_button.user.id}/${get_button.user.avatar}.png?size=256`});
                                
                            await get_button.deferUpdate()
                            await get_button.editReply({embeds: [embed], components: [emojiquiz_moderation_btns] });
                            await get_button.followUp({content: `You declined **${get_button.message.embeds[0].data.footer.text}** emojiquiz suggestion. ❌`, ephemeral: true});
                            } catch (error) {
                                console.log(error);
                                return;
                            }  
                        }
                        make_a();
                    });
            }
            make_a();
        }
    }

    suggest_new_quiz() {
        this.#suggest_new_quiz_moderation();
        const emojiquiz_moderation_btns = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.emojiquiz_decline.label)
            .setCustomId('emojiquiz_decline')
            .setStyle(emojiquizContent.buttons.emojiquiz_decline.style),
            new ButtonBuilder()
            .setLabel(emojiquizContent.buttons.emojiquiz_accept.label)
            .setCustomId('emojiquiz_accept')
            .setStyle(emojiquizContent.buttons.emojiquiz_accept.style)     
    );       
        let get_button = this.button;  
        let get_connection = this.connection;   
        const make_a = async function() {
            try {
                if (get_button.isButton()) {
                    if (get_button.customId === 'suggest_new_quiz') {
                      const modal = new ModalBuilder()
                        .setCustomId('emojiquiz')
                        .setTitle(emojiquizContent.suggest_new_quiz_pop_up.title)
                        .addComponents([
                          new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                              .setCustomId('emoji_word_input')
                              .setLabel(emojiquizContent.suggest_new_quiz_pop_up.emoji_word.label)
                              .setStyle(TextInputStyle.Short)
                              .setMinLength(1)
                              .setMaxLength(100)
                              .setPlaceholder(emojiquizContent.suggest_new_quiz_pop_up.emoji_word.placeholder)
                              .setRequired(true),
                          ),
                          new ActionRowBuilder().addComponents(
                          new TextInputBuilder()
                          .setCustomId('hint_word_input')
                          .setLabel(emojiquizContent.suggest_new_quiz_pop_up.emoji_hint.label)
                          .setStyle(TextInputStyle.Short)
                          .setMinLength(1)
                          .setMaxLength(100)
                          .setPlaceholder(emojiquizContent.suggest_new_quiz_pop_up.emoji_hint.placeholder)
                          .setRequired(true)
                          ),
                          new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                            .setCustomId('searched_word_input')
                            .setLabel(emojiquizContent.suggest_new_quiz_pop_up.emoji_searched.label)
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setPlaceholder(emojiquizContent.suggest_new_quiz_pop_up.emoji_searched.placeholder)
                            .setRequired(true)
                            ),
                        ]);
                
                     await get_button.showModal(modal);
                    }
                  }
                  if (get_button.type === InteractionType.ModalSubmit) {
                      const emoji_word_response = get_button.fields.getTextInputValue('emoji_word_input');
                      const hint_word_response = get_button.fields.getTextInputValue('hint_word_input');
                      const searched_word_response = get_button.fields.getTextInputValue('searched_word_input');
                      let get_emojiquiz2 = `SELECT * FROM emojiquiz WHERE ${get_button.guildId}`;
                      get_connection.query(get_emojiquiz2, function (err, data, result) {
                      var row_nod;
                      Object.keys(data).forEach(function(key) {
                      row_nod = data[key];
                      });
                      const make_a_2 = async function() {
                    try {
                        let get_data = JSON.parse(row_nod.data);
        
                        let find_duplicate = get_data.find(e => e.word === emoji_word_response || e.searched === searched_word_response);
                        if (find_duplicate !== undefined) {
                            return await get_button.reply({content: emojiquizContent.alreadyExist.suggest_new_quiz_text, ephemeral: true});
                        }    
                      await get_button.reply({content: `Your emojiquiz suggestion is submitted!\n**word:** ${emoji_word_response}\n**hint:** ${hint_word_response}\n**searched:** ${searched_word_response}`, ephemeral: true});
                      const emoji_embed = new EmbedBuilder()
                        .setTitle(emojiquizContent.title)
                        .setDescription(emojiquizContent.description)
                        .addFields(
                        { name: emojiquizContent.fields.first, value: emoji_word_response, inline: true},
                        { name: emojiquizContent.fields.second, value: hint_word_response, inline: true },
                        { name: emojiquizContent.fields.status_text, value: emojiquizContent.fields.status, inline: false}
                        )
                        .setColor(emojiquizContent.moderation_status.pending_color)
                        .setFooter({ text: `${get_button.user.tag}`, iconURL: `https://cdn.discordapp.com/avatars/${get_button.user.id}/${get_button.user.avatar}.png?size=256`});
                        await get_button.member.guild.channels.cache.get(row_nod.pendingChannelID).send({content: `${emojiquizContent.moderation_status.solution}: **${searched_word_response}**`, embeds: [emoji_embed], components: [emojiquiz_moderation_btns]});
                        if (row_nod.pendingData === null) {
                            let pendingData = [];
                            pendingData.push({word: emoji_word_response, hint: hint_word_response, searched: searched_word_response})
                            let getinfo = `UPDATE emojiquiz SET pendingData = '${JSON.stringify(pendingData)}' WHERE guildID = ${get_button.guildId}`;
                            get_connection.query(getinfo, function (err, data, result) {
                            }); 
                        } else {
                            let get_pending_data = JSON.parse(row_nod.pendingData);
                            get_pending_data.push({word: emoji_word_response, hint: hint_word_response, searched: searched_word_response});
                            let getinfo = `UPDATE emojiquiz SET pendingData = '${JSON.stringify(get_pending_data)}' WHERE guildID = ${get_button.guildId}`;
                            get_connection.query(getinfo, function (err, data, result) {
                            });
                        }
                        } catch (error) {
                            return;
                        } 
                      }	
                      make_a_2();
                    });
                  }
                } catch (error) {
                    return;
                }
            } 
           
            make_a();
    }

}
