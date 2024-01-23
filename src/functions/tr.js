const {createCanvas,registerFont} = require('canvas')
const discord = require('discord.js')
const words = require('./assets/words.json').words
registerFont(__dirname+'/assets/Roboto-Medium.ttf', {family:'Roboto'})
class TypeRunner {
  /**
   * Initialises a new instance of Type Runner Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {TypeRunner} Game instance.
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
      this.time = gameOptions?.time ?? 120000;
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
      this.getSentence = () => {
        const number = this.randomN(0,words.length - 11);
        return words.slice(number,number+10).map(x => x[0].toUpperCase() + x.slice(1,x.length)).join(" ");
      }
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      this.onTimeUp = gameOptions?.onTimeUp ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a funtion');
      if(this.onTimeUp && typeof this.onTimeUp !== 'function') throw new TypeError('onTimeUp must be a Function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.time < 20000) throw new RangeError('time must be greater than 20000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a string');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a string');
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
const game = this;
const sentence  = this.getSentence();
const canvas = createCanvas(650,50);
const context = canvas.getContext('2d');
context.fillStyle = 'black';
context.fillRect(0,0,canvas.width,canvas.height);
context.font = '20px Roboto'
context.fillStyle = 'white';
context.fillText(sentence,10,25)
function wordEmbed(canvas,color,des) {
const image = new discord.AttachmentBuilder().setFile(canvas.toBuffer()).setName('sentence.png')
const embed = new discord.EmbedBuilder()
.setColor(color)
.setThumbnail(game.player.avatarURL())
.setTimestamp()
.setFooter({text:`Requested by ${game.player.username}`})
.setTitle(game.options?.title ?? "Type Runner")
.setImage("attachment://sentence.png")
if(des) embed.setDescription(des)
return {embeds:[embed],files:[image] };
}
const msg = await this.edit(wordEmbed(canvas,'Aqua',this.options?.startDes ?? "Type the following sentence as fast as you can. (including Capitals)"),this.message)
try {
const start = Date.now();
const response = await msg.channel.awaitMessages({filter: (m) => m.content && m.author.id == (this.message.user ? this.message.user.id : this.message.author.id), time: this.time,max:1})
const duration = Date.now() - start;
const time = parseFloat(Math.floor(duration/1000)) + parseFloat(parseFloat(parseInt(`${duration/1000}`.split('.')[1])/1000).toFixed(2));
if(response.first().content == sentence) {
  await this.edit(wordEmbed(canvas,'Green',this.options?.winDes?.replace(/{time}/g,time) ?? `You Won! You took ${time} seconds to type the sentence.`),msg)
  if(this.onWin) await this.onWin(time);
}
else {
  await this.edit(wordEmbed(canvas,'Red',this.options?.loseDes?.replace(/{time}/g,time) ?? `You Lost! You failed to type the sentence correctly. You took ${time} seconds.`),msg);
  if(this.onLose) await this.onLose(time);
}
}
catch(e) {
  await this.edit(wordEmbed(canvas,'Red',this.options?.timeUpDes ?? "Time Up!, you failed to type the sentence in time."),msg)
  if(this.onTimeUp) return this.onTimeUp();
}
   }
 }
 
 module.exports = TypeRunner;