const discord = require('discord.js')
/**
 *  Start 8ball Game.
 * @param {discord.Message | discord.ChatInputCommandInteraction} message Discord Message Object or Interaction Object.
 * @param {String} question Question.
 * @returns {discord.Message} Message Object of the Game.
 */
async function EightBall(message,question) {
 if(!question || typeof question !== "string") throw new TypeError('Expected a valid String question');
 if(!message || !(message instanceof discord.Message || message instanceof discord.CommandInteraction)) throw new TypeError('Expected a valid Discord Message Object or Discord CommandInteraction Object');
 try {
 const answer = ["yes","no","absolutely","absolutely not","maybe","maybe not","probably","i don't know"][Math.floor(Math.random() * 8 + 1)]
 const Embed = new discord.EmbedBuilder()
 .setTitle('8ball')
 .setTimestamp()
 .setThumbnail(message.author ? message.author.avatarURL() : message.user.avatarURL())
 .addFields({
    name:"Question:",
    value: question.endsWith('?') ? question : question+'?',
    inline:false
 },
 {
    name:"Answer:",
    value:answer+'.',
    inline:false
 })
.setColor('Yellow')
.setFooter({text:`Requested by ${message?.author?.username ?? message?.user?.username}`})

if(message instanceof discord.Message) {
    return await message.reply({embeds:[Embed]});
}
else {
    if(message.deferred) return await message.editReply({embeds:[Embed],fetchReply:true});
    else return await message.reply({embeds:[Embed],fetchReply:true});
}}
catch(e) {
    throw new Error(e)
}
}
module.exports = EightBall;