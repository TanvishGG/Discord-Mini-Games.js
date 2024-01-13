const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class FindTheStone {
  /**
   * Initialises a new instance of Find The Stone Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {FindTheStone} Game instance.
   */

    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an object");
      this.isSlash = gameOptions?.isSlash ?? false;
      if(this.isSlash == true){
        if(!(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of command interaction") 
      }} else {
        if(!(this.message instanceof discord.Message)) {
          throw new TypeError("message must be an instance of Discord message")
        }
      }
      this.player = this.isSlash == true ? this.message?.user : this.message?.author;
      this.time = gameOptions?.time ?? 45000;
      this.replied = false;
      this.randomN = (min,max) => {return Math.floor(Math.random()*max)+min;}
      this.edit = async (messageOptions,replyMessage) => {
        if(this.isSlash == true) {
          messageOptions.fetchReply = true;
          return await replyMessage.editReply(messageOptions)
        }
        else {
          if(this.replied == false) {
          this.replied=true; return await this.message.reply(messageOptions);}
          else return await replyMessage.edit(messageOptions)
        }
      }

    }
    /**
     * Starts The Game.
     */
async run(onWin) {
  if(this.isSlash == true) {
    this.message.deferReply().catch(() => {});
  }
  function ftsEm(text,color) {
    const embed = new EmbedBuilder()
    .setTitle("Find The Stone")
    .setImage('https://tanvish.me/assets/images/cups_temp.jpg')
    .setDescription(text)
    .setColor(color)
    return embed;
  }
  function randomN(min,max) {
return Math.floor(Math.random() *(max-min+1) + min);
  }
const choices = ['yellow','red','blue']
var Row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('yellow').setStyle(ButtonStyle.Secondary).setEmoji('🟡'),new ButtonBuilder().setCustomId('red').setStyle(ButtonStyle.Secondary).setEmoji('🔴'),new ButtonBuilder().setCustomId('blue').setEmoji('🔵').setStyle(ButtonStyle.Secondary))
const bot = choices[randomN(0,2)]
const msg = await this.edit({embeds:[ftsEm('Find the cup which has a stone under it!','Green')],components:[Row]},this.message)
let played = false;
const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button,time:15000})
collector.on('collect', async (i) => {
  i.deferUpdate()
if(i.user.id == this.player.id) {
  played = true;
  collector.stop()
  Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
  if(i.customId == bot) {
    await this.edit({embeds:[ftsEm(`You Won!, it was ${bot.toUpperCase()} Cup`,'Yellow')],components:[Row]},msg)
    if(onWin) await onWin();
  }
  else {
    await this.edit({embeds:[ftsEm(`You Lost!, it was ${bot.toUpperCase()} Cup`,'Red')],components:[Row]},msg)
    return "lost";
  }
}
})
collector.on('end', async () => {
  if(played == false) {
    Row.components.forEach(x => x.setDisabled(true))
 await this.edit({embeds:[ftsEm('Game Ended: Timed Out','Red')],components:[Row]},msg)
 return "timeup";
  }
})
  
}


  }

  module.exports = FindTheStone;