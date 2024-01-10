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
      if(this.isSlash == true && !(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of command interaction") 
      } else {
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
  function lower(number,guess) {
    if(number >= guess) { return "HIGHER" }
    else { return "LOWER" }
}
function random(min, max) {

      return Math.floor(Math.random() * (max - min + 1) + min)

      } 


function embedGen(text, color) {
    const embed = new discord.EmbedBuilder()
    .setTitle("Guess The Number")
    .setDescription(`Guess the number iam thinking of in 3 tries which lies between 1-20 ${text ? `\n\n\`\`\`${text}\`\`\``:""}`)
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
collector.on('collect', m => {
    if(m.content == number) { 
        m.delete();
        played = true;
        collector.stop();
        this.edit({embeds:[embedGen(`You guessed it right!, the number was ${number}`,'Green')]},msg)
    }
    else{
     tries--;
     m.delete()
     if(tries == 0) {
     played = true;
     this.edit({embeds:[embedGen(`You Lost. You guessed ${m.content}, but the number was ${number}`,'Red')]},msg)
     }
     else {
        this.edit({embeds:[embedGen(`You guessed ${m.content} which is wrong, you have ${tries} tries left\nNumber is ${lower(number,m.content)} than ${m.content}`,'Red')]},msg)
    }}
    });
collector.on('end', collected => {
    if(played == false) {
        this.edit({embeds:[embedGen('Game Ended: Timed Out','Red')]},msg)
    }
})
}

  }

  module.exports = GuessTheNumber;