const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class GuessTheNumber{
  /**
   * Initialises a new instance of Guess The Number Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {GuessTheNumber} Game instance.
   */

    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an object");
      this.isSlash = gameOptions?.isSlash ?? false;
      if(this.isSlash == true){
        if(!(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of command interaction") 
     } } else {
        if(!(this.message instanceof discord.Message)) {
          throw new TypeError("message must be an instance of Discord message")
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
            if(this.isSlash == true) return await messageOptions.editReply(messageOptions)
            return await this.message.reply(messageOptions);}
            else return await replyMessage.edit(messageOptions)
         }
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a funtion');
   
    }
    /**
     * Starts The Game.
     */
async run() {
  if(this.isSlash == true) {
    await this.message.deferReply().catch(() => {});
  }
  function lower(number,guess) {
    if(number >= guess) { return "HIGHER" }
    else { return "LOWER" }
}
function random(min, max) {

      return Math.floor(Math.random() * (max - min + 1) + min)

      } 


function embedGen(text, color) {
    const embed = new discord.EmbedBuilder()
    .setTitle(this.options.title ??"Guess The Number")
    .setDescription(`${this.options?.startDes ?? `Guess the number iam thinking of in 3 tries which lies between 1-20`} ${text ? `\n\n\`\`\`${text}\`\`\``:""}`)
    .setColor(color)
    .setTimestamp()
    .setThumbnail(this.player.avatarURL());
    return embed;
}
const number = random(1,20)
let tries = 3;
const msg = await this.edit({embeds:[embedGen(null,"Blue")]},this.message)
const collectorFilter = m => m && m.author.id == this.player.id && !isNaN(m.content) && m.content < 21 && m.content > 0;
const collector = msg.channel.createMessageCollector({ filter: collectorFilter, time: 90000, max:3 });
let played = false;
collector.on('collect', async m => {
    if(m.content == number) { 
        m.delete();
        played = true;
        collector.stop();
        this.edit({embeds:[embedGen(this.options?.winDes?.replace(/{number}/g,number) ?? `You guessed it right!, the number was ${number}`,'Green')]},msg)
    if(this.onWin) await this.onWin();
    }
    else{
     tries--;
     m.delete()
     if(tries == 0) {
     played = true;
     this.edit({embeds:[embedGen(this.options?.loseDes?.replace(/{user_option}/g,m.content)?.replace(/{number}/g,number) ?? `You Lost. You guessed ${m.content}, but the number was ${number}`,'Red')]},msg)
     }
     else {
        this.edit({embeds:[embedGen(this.options?.retryDes?.replace(/{user_option}/g,m.content)?.replace(/{tries}/g,tries)?.replace(/{status}/g,lower(number,m.content)) ?? `You guessed ${m.content} which is wrong, you have ${tries} tries left\nNumber is ${lower(number,m.content)} than ${m.content}`,'Red')]},msg)
      if(this.onLose) await this.onLose();
    }}
    });
collector.on('end', collected => {
    if(played == false) {
        this.edit({embeds:[embedGen(this.options?.timeUpDes ?? 'Game Ended: Timed Out','Red')]},msg)
    }
})
}

  }

  module.exports = GuessTheNumber;