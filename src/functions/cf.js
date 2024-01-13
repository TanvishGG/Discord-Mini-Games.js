const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class CoinFlip{
  /**
   * Initialises a new instance of CoinFlip Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {CoinFlip} Game instance.
   */

    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an object");
      this.isSlash = gameOptions?.isSlash ?? false;
      if(this.isSlash == true) {
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
async run() {
  if(this.isSlash == true) {
    await this.message.deferReply().catch(() => {});
  }
  function cfEm(text,color) {
    const embed = new EmbedBuilder()
   .setTitle("Coin Flip")
   .setDescription(text)
   .setColor(color)
   .setThumbnail(this.player.avatarURL())
   return embed;
  }
  function randomN(min,max) {
    return Math.floor(Math.random() *(max-min+1) + min);
  }
  var Row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('heads').setStyle(ButtonStyle.Secondary).setLabel('Heads'), new ButtonBuilder().setCustomId('tails').setStyle(ButtonStyle.Secondary).setLabel('Tails'))
 const msg = await this.edit({embeds:[cfEm('Choose Heads or Tails','Green')],components:[Row]},this.message)
  const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time:15000})
  let played = false;
  const choices = ['heads','tails']
  const bot = choices[randomN(0,1)]
  collector.on('collect', async (i) => {
    i.deferUpdate()
if(i.user.id == this.player.id) {
   played = true;
   collector.stop()
   Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
   if(i.customId == bot) {
    await this.edit({embeds:[cfEm(`You won!, it was ${bot.toUpperCase()}`,`Yellow`)],components:[Row]},msg)
    return "win";
   }
   else {
    await this.edit({embeds:[cfEm(`You Lost!, it was ${bot.toUpperCase()}`,`Red`)],components:[Row]},msg)
    return "lose";
   }
  }
  })
  collector.on('end', async (collected) => {
    if(played == false) {
      Row.components.forEach(x => x.setDisabled(true))
      await this.edit({embeds:[cfEm(`Game Ended: Timed Out`,'Red')],components:[Row]},msg)
      return "timeup";
    }
  })
}

  }

module.exports = CoinFlip;