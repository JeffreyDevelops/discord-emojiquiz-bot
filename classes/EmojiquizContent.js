const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { inlineCode, codeBlock } = require('discord.js');
exports.emojiquizContent = {
    title: '**Emojiquiz**',
    description: 'If you have any issues to solve that emojiquiz then you can click the buttons to get some help.',
    fields: {
        first: '❓Searched word',
        second: '❗Hint',
        status_text: 'Status',
        status: inlineCode("🟡 Pending")
    },
    color: '#FFFFFF',
    footer: {
        text: 'Emojiquiz ~ solved the last emojiquiz! 😄',
        skip_text: '~ skipped the last emojiquiz! 👀',
        iconURL: 'https://i.imgur.com/OHN3crW.png',
        textonstart: '~ solved the last emojiquiz! 😄'
    },
    solution: `That's how it will look like!\nSearched word:`,
    buttons: {
        skip: {
            label: 'Skip word',
            style: ButtonStyle.Secondary,
            emoji: '⏩'
        },
        first_letter: {
            label: 'First Letter',
            style: ButtonStyle.Secondary,
            emoji: '⚡'
        },
        suggest_new_quiz: {
            label: 'Suggest new quiz',
            style: ButtonStyle.Secondary,
            emoji: '🤳'
        },
        emojiquiz_decline: {
            label: 'Decline',
            style: ButtonStyle.Danger
        },
        emojiquiz_accept: {
            label: 'Accept',
            style: ButtonStyle.Success
        }
    },
    first_letter_text: 'The first letter is a',
    moderation_status: {
        accept_text: '**Status:**\n',
        accept_status: inlineCode("🟢 Accepted"),
        decline_text: '**Status:**\n',
        decline_status: inlineCode("🔴 Denied"),
        pending_color: '#9b8f22',
        solution: inlineCode("Solution")
    },
    suggest_new_quiz_pop_up: {
        title: 'Emojiquiz suggestion',
        emoji_word: {
            label: 'Word in emoji',
            placeholder: 'Enter word in emojis.'
        },
        emoji_hint: {
            label: 'Hint',
            placeholder: 'Give a hint.'
        },
        emoji_searched: {
            label: 'Searched Word',
            placeholder: 'Enter the searched word.'
        }
    }
}