const discord = require('discord.js');
const {createCanvas,registerFont} = require('canvas')
const words = require('./assets/words.json').words
registerFont(__dirname+'/assets/Roboto-Medium.ttf', {family:'Roboto'})
class Wordle{
  /**
   * Initialises a new instance of Wordle Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {Wordle} Game instance.
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
      this.time = gameOptions?.time ?? 180000;
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
      this.word = words[this.randomN(0,words.length)]
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a funtion');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
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
const canvas = createCanvas(300,300);
const context = canvas.getContext('2d');
context.fillStyle ='#7d7c78'
context.fillRect(1,1,canvas.width -1,canvas.height-1)
const gridSize = 60;
const gridColor = '#000000';
    context.strokeStyle = gridColor;
    context.lineWidth = 2;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
    function drawLetter(letter, color,xGrid, yGrid) {
        const colors = {'red':"#fa5c43",'lime':"#03fc0b",'yellow':"#f5d72f"}
        context.fillStyle = colors[color]
        context.fillRect(xGrid * gridSize + 1, yGrid * gridSize + 1, gridSize - 2, gridSize - 2)    
        context.font = '60px Roboto';
        context.fillStyle = 'black';
        const x = xGrid * gridSize + (gridSize - context.measureText(letter).width) / 2;
        const y = (yGrid * gridSize + gridSize / 2 + 60 / 2) -5;
        context.fillText(letter, x, y);
    }
function drawAndVerifyWord(word,newWord,chance) {
    const wordLetters = word.toUpperCase().split("")
    const newWordLetters = newWord.toUpperCase().split("")
    let correctLetters = 0;
newWordLetters.forEach((l,i) => {
    if(l == wordLetters[i]) {
        correctLetters++
       drawLetter(l,"lime",i,chance)
    }
    else {
        if(wordLetters.includes(l)) {
            drawLetter(l,"yellow",i,chance)
        }
        else {
            drawLetter(l,"red",i,chance)
        }
    }
})
if(correctLetters == wordLetters.length) return "win";
else return "lose";
}
let chance = 0,played =false;
const game = this;
function wordEmbed(canvas,color,des) {
const image = new discord.AttachmentBuilder().setFile(canvas.toBuffer()).setName('wordle.png')
const embed = new discord.EmbedBuilder()
.setColor(color)
.setTitle(game.options?.title ?? "Wordle")
.setImage("attachment://wordle.png")
if(des) embed.setDescription(des)
return {embeds:[embed],files:[image] };
}
const msg = await this.edit(wordEmbed(canvas,"Yellow",this,options?.startDes ?? 'Guess the 5 Letter Word I\'m thinking of'),this.message)
const filter = m => m.author.id == this.player.id && m.content.length == 5 && /^[a-zA-Z]+$/.test(m.content);
const collector = this.message.channel.createMessageCollector({filter:filter,time:this.time,max:5})
collector.on('collect', async m => {
  const attempt = m.content;
  const result = drawAndVerifyWord(this.word,attempt,chance)
  m.delete().catch(() => {})
  if(result == "win") {
    played = true;
    collector.stop()
    this.edit(wordEmbed(canvas,"Green",this.options?.winDes?.replace(/{word}/g,this.word) ?? "You Won!"),msg);
    if(this.onWin) await this.onWin();

  }
  else {
    chance++
    if(chance == 5) {
      played = true;
      this.edit(wordEmbed(canvas,"Red",this.options?.loseDes?.replace(/{word}/g,this.word) ?? "You Lost!, The word was "+this.word),msg)
      if(this.onLose) await this.onLose();
     }
    else {
    this.edit(wordEmbed(canvas,"Red"),msg)
    }
  }
})
collector.on('end', () => {
   if(played == false) {
    this.edit(wordEmbed(canvas,'Red',this.options?.timeUpDes ?? 'Game Over: Timed Out!'),msg)
   }
})
  }
}

module.exports = Wordle;