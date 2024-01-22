const discord = require('discord.js');
const pokemons = require('./assets/pokemon.json').pokemons;
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class GuessThePokemon{
  /**
   * Initialises a new instance of Guess The Pokemon Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {GuessThePokemon} Game instance.
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
      this.pokemon = pokemons[this.randomN(0,pokemons.length-1)]
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
    .setTitle(game.options?.title ??"Guess The Pokemon")
    .setDescription(text)
    .setColor(color)
    .setTimestamp()
    .setImage(`https://tanvishgg.github.io/assets/pokemons/${game.pokemon.name}.png`)
    .setFooter({text:`Requested by ${game.player.username}`})
    .setThumbnail(game.player.avatarURL());
    return embed;
}
const pokemon = this.pokemon.name.replace(/-/g," ");
const hint = `\`${pokemon.replace(/-/g," ").replace(/[^0-9\s]/g, '_')}\``;
let tries = this.options?.tries ?? 2;
const msg = await this.edit({embeds:[embedGen(this.options?.startDes?.replace(/{hint}/g,hint)?.replace(/{tries}/g,tries) ?? `Guess the below Pikemon in ${tries} tries. \n Hint: ${hint}`,"Blue")]},this.message)
const collectorFilter = m => m && m.author.id == this.player.id;
const collector = msg.channel.createMessageCollector({ filter: collectorFilter, idle: this.time, max:tries});
let played = false;
collector.on('collect', async m => {
    if(m.content.toLowerCase() == pokemon.toLowerCase()) { 
        m.delete();
        played = true;
        collector.stop();
        this.edit({embeds:[embedGen(this.options?.winDes?.replace(/{pokemon}/g,`\`${pokemon}\``) ?? `You guessed it right!, the Pokemon is \`${pokemon}\``,'Green')]},msg)
    if(this.onWin) await this.onWin();
    }
    else{
     tries--;
     m.delete()
     if(tries == 0) {
     played = true;
     this.edit({embeds:[embedGen(this.options?.loseDes?.replace(/{user_option}/g,`\`${m.content}\``)?.replace(/{pokemon}/g,`\`${pokemon}\``) ?? `You Lost. You guessed \`${m.content}\`, but the Pokemon is \`${pokemon}\``,'Red')]},msg)
     }
     else {
      this.edit({embeds:[embedGen(this.options?.retryDes?.replace(/{user_option}/g,`\`${m.content}\``)?.replace(/{tries}/g,tries)?.replace(/{hint}/g,hint) ?? `You guessed \`${m.content}\` which is wrong, you have ${tries} tries left\nHint: ${hint}`,'Red')]},msg)
      if(this.onLose) await this.onLose();
    }}
    });
collector.on('end', async () => {
    if(played == false) {
    await this.edit({embeds:[embedGen(this.options?.timeUpDes?.replace(/{pokemon}/g,`\`${pokemon}\``) ?? `Game Ended: Timed Out, the Flag belongs to \`${pokemon}\``,'Red')]},msg)
    if(this.onTimeUp) await this.onTimeUp();
    }
})
}

  }

  module.exports = GuessThePokemon;