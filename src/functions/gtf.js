const discord = require('discord.js');
const flags = require('./assets/flags.json').flags;
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class GuessTheFlag{
  /**
   * Initialises a new instance of Guess The Flag Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {GuessTheFlag} Game instance.
   */

    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an Object");
      this.isSlash = gameOptions?.isSlash ?? false;
      if(this.isSlash == true){
        if(!(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of Command Interaction") 
     } } else {
        if(!(this.message instanceof discord.Message)) {
          throw new TypeError("message must be an instance of Discord Message")
        }
      }
      this.player = this.isSlash == true ? this.message?.user : this.message?.author;
      this.time = gameOptions?.time ?? 45000;
      this.replied = false;
      this.randomN = (min,max) => {return Math.floor(Math.random()*max)+min;}
      this.flag = flags[this.randomN(0,flags.length-1)]
      this.edit = async (messageOptions,replyMessage) => {
        messageOptions.fetchReply = true;
         if(this.replied == false) {
            this.replied=true; 
            if(this.isSlash == true) return await replyMessage.editReply(messageOptions)
            return await this.message.reply(messageOptions);}
            else return await replyMessage.edit(messageOptions)
         }
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      this.onTimeUp = gameOptions?.onTimeUp ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a Funtion');
      if(this.onTimeUp && typeof this.onTimeUp !== 'function') throw new TypeError('onTimeUp must be a Function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a Number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.tries && typeof this.options?.tries !== 'number') throw new TypeError('tries must be a Number');
      if(this.options?.tries && (this.options?.tries < 2 || this.options?.tries > 10)) throw new RangeError('tries must be between 3 and 10');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a String');
      if(this.options?.retryDes && typeof this.options?.retryDes !== 'string') throw new TypeError('retryDes must be a String');
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
function embedGen(text, color) {
    const embed = new discord.EmbedBuilder()
    .setTitle(game.options?.title ??"Guess The Flag")
    .setDescription(text)
    .setColor(color)
    .setTimestamp()
    .setImage('attachment://flag.png')
    .setFooter({text:`Requested by ${game.player.username}`})
    .setThumbnail(game.player.avatarURL());
    return embed;
}
const country = this.flag.name;
const hint = `\`${country.replace(/[^0-9\s]/g, '_')}\``;
const file = new discord.AttachmentBuilder().setFile(Buffer.from(this.flag.flag,'base64')).setName('flag.png');
let tries = this.options?.tries ?? 2;
const msg = await this.edit({embeds:[embedGen(this.options?.startDes?.replace(/{hint}/g,hint)?.replace(/{tries}/g,tries) ?? `Guess the Country name to which the following Flag belongs in ${tries} tries. \n Hint: ${hint}`,"Blue")],files:[file]},this.message)
const collectorFilter = m => m && m.author.id == this.player.id;
const collector = msg.channel.createMessageCollector({ filter: collectorFilter, idle: this.time, max:tries});
let played = false;
collector.on('collect', async m => {
    if(m.content.toLowerCase() == country.toLowerCase()) { 
        m.delete();
        played = true;
        collector.stop();
        this.edit({embeds:[embedGen(this.options?.winDes?.replace(/{country}/g,`\`${country}\``) ?? `You guessed it right!, the Flag belongs to \`${country}\``,'Green')]},msg)
    if(this.onWin) await this.onWin();
    }
    else{
     tries--;
     m.delete()
     if(tries == 0) {
     played = true;
     this.edit({embeds:[embedGen(this.options?.loseDes?.replace(/{user_option}/g,`\`${m.content}\``)?.replace(/{country}/g,`\`${country}\``) ?? `You Lost. You guessed \`${m.content}\`, but the Flag belongs to \`${country}\``,'Red')]},msg)
     }
     else {
      this.edit({embeds:[embedGen(this.options?.retryDes?.replace(/{user_option}/g,`\`${m.content}\``)?.replace(/{tries}/g,tries)?.replace(/{hint}/g,hint) ?? `You guessed \`${m.content}\` which is wrong, you have ${tries} tries left\nHint: ${hint}`,'Red')]},msg)
      if(this.onLose) await this.onLose();
    }}
    });
collector.on('end', async () => {
    if(played == false) {
    await this.edit({embeds:[embedGen(this.options?.timeUpDes?.replace(/{country}/g,`\`${country}\``) ?? `Game Ended: Timed Out, the Flag belongs to \`${country}\``,'Red')]},msg)
    if(this.onTimeUp) await this.onTimeUp();
    }
})
}

  }

  module.exports = GuessTheFlag;