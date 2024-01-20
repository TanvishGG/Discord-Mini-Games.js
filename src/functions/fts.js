const discord = require('discord.js');
const file = new discord.AttachmentBuilder().setName('fts.jpg').setFile('./assets/fts.jpg')
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class FindTheStone {
  /**
   * Initialises a new instance of Find The Stone Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {FindTheStone} Game instance.
   */

    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an Object");
      this.isSlash = gameOptions?.isSlash ?? false;
      if(this.isSlash == true){
        if(!(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of Command Interaction") 
      }} else {
        if(!(this.message instanceof discord.Message)) {
          throw new TypeError("message must be an instance of Discord Message")
        }
      }
      this.player = this.isSlash == true ? this.message?.user : this.message?.author;
      this.time = gameOptions?.time ?? 45000;
      this.replied = false;
      this.randomN = (min,max) => {return Math.floor(Math.random()*max)+min;}
      this.edit = async (messageOptions,replyMessage) => {
         messageOptions.fetchReply = true;
         if(this.replied == false) {
            this.replied=true; 
            if(this.isSlash == true) return await replyMessage.editReply(messageOptions)
            return await this.message.reply(messageOptions);}
            else return await replyMessage.edit(messageOptions)
          };
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a Funtion');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a Number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a String');
      if(this.options?.winDes && typeof this.options?.winDes !== 'string') throw new TypeError('winDes must be a String');
      if(this.options?.loseDes && typeof this.options?.loseDes !== 'string') throw new TypeError('loseDes must be a String');
      if(this.options?.timeUpDes && typeof this.options?.timeUpDes !== 'string') throw new TypeError('timeUpDes must be a String');

    }
    /**
     * Starts The Game.
     */
async run() {
  if(this.isSlash == true) {
    await this.message.deferReply().catch(() => {});
  }
  const game = this;
  function ftsEm(text,color) {
    const embed = new EmbedBuilder()
    .setTitle(game.options?.title ??"Find The Stone")
    .setImage('attachment://fts.jpg')
    .setDescription(text)
    .setColor(color)
    .setTimestamp()
    .setThumbnail(game.player.avatarURL())
    .setFooter({text:`Requested by ${game.player.username}`})
    return embed;
  }
  function random(min,max) {
return Math.floor(Math.random() *(max-min+1) + min);
  }
const choices = ['yellow','red','blue']
var Row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('fts_yellow').setStyle(ButtonStyle.Secondary).setEmoji('🟡'),new ButtonBuilder().setCustomId('fts_red').setStyle(ButtonStyle.Secondary).setEmoji('🔴'),new ButtonBuilder().setCustomId('fts_blue').setEmoji('🔵').setStyle(ButtonStyle.Secondary))
const bot = choices[random(0,2)]
const msg = await this.edit({files:[file],embeds:[ftsEm(this.options?.startDes ?? 'Find the Cup which has a Stone under it!','Green')],components:[Row]},this.message)
let played = false;
const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button,idle:this.time})
collector.on('collect', async (i) => {
await i.deferUpdate()
if(i.user.id == this.player.id) {
  played = true;
  collector.stop()
  Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
  if(i.customId.replace('fts_','') == bot) {
    await this.edit({files:[file],embeds:[ftsEm(this.options?.winDes?.replace(/{user_option}/g,i.customId.replace('fts_','').toUpperCase())?.replace(/{bot_option}/g,bot.toUpperCase()) ?? `You Won!, it was ${bot.toUpperCase()} Cup`,'Yellow')],components:[Row]},msg)
    if(this.onWin) await this.onWin();
  }
  else {
    await this.edit({files:[file],embeds:[ftsEm(this.options?.loseDes?.replace(/{user_option}/g,i.customId.replace('fts_','').toUpperCase())?.replace(/{bot_option}/g,bot.toUpperCase()) ?? `You Lost!, it was ${bot.toUpperCase()} Cup`,'Red')],components:[Row]},msg)
    if(this.onLose) await this.onLose();
  }
}
})
collector.on('end', async () => {
  if(played == false) {
  Row.components.forEach(x => x.setDisabled(true))
  await this.edit({files:[file],embeds:[ftsEm(this.options?.timeUpDes ?? 'Game Ended: Timed Out','Red')],components:[Row]},msg)
  }
})
}}

  module.exports = FindTheStone;