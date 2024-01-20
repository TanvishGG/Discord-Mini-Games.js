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
            if(this.isSlash == true) return await replyMessage.editReply(messageOptions)
            return await this.message.reply(messageOptions);}
            else return await replyMessage.edit(messageOptions)
         }
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a funtion');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.tries && typeof this.options?.tries !== 'number') throw new TypeError('tries must be a number');
      if(this.options?.tries && (this.options?.tries < 3 || this.options?.tries > 10)) throw new RangeError('tries must be between 3 and 10');
      if(this.options?.max && typeof this.options?.max !== 'number') throw new TypeError('max must be a number');
      if(this.options?.max && (this.options?.max < 10 || this.options?.max > 100)) throw new RangeError('max must be between 10 and 100');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a string');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a string');
      if(this.options?.retryDes && typeof this.options?.retryDes !== 'string') throw new TypeError('retryDes must be a string');
      if(this.options?.winDes && typeof this.options?.winDes !== 'string') throw new TypeError('winDes must be a string');
      if(this.options?.loseDes && typeof this.options?.loseDes !== 'string') throw new TypeError('loseDes must be a string');
      if(this.options?.timeUpDes && typeof this.options?.timeUpDes !== 'string') throw new TypeError('timeUpDes must be a string');
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
const game = this;

function embedGen(text, color) {
    const embed = new discord.EmbedBuilder()
    .setTitle(game.options.title ??"Guess The Number")
    .setDescription(`${game.options?.startDes ?? `Guess the number iam thinking of in ${game.options?.tries ?? 3 } tries which lies between 1-${game.options?.max ?? 20}`} ${text ? `\n\n\`\`\`${text}\`\`\``:""}`)
    .setColor(color)
    .setTimestamp()
    .setThumbnail(this.player.avatarURL());
    return embed;
}
const number = random(1,this.options?.max ?? 20)
let tries = this.options?.tries ?? 3;
const msg = await this.edit({embeds:[embedGen(null,"Blue")]},this.message)
const collectorFilter = m => m && m.author.id == this.player.id && !isNaN(m.content) && m.content < 21 && m.content > 0;
const collector = msg.channel.createMessageCollector({ filter: collectorFilter, time: 90000, max:this.options?.tries ?? 3 });
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