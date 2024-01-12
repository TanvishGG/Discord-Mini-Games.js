const discord = require('discord.js');
const {createCanvas,registerFont} = require('canvas')
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
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
      if(this.isSlash == true && !(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of command interaction") 
      } else {
        if(!(this.message instanceof discord.Message)) {
          throw new TypeError("message must be an instance of Discord message")
        }
      }
      this.player = this.isSlash == true ? this.message?.user : this.message?.author;
      this.time = gameOptions?.time ?? 60000;
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
      this.words = require('../assets/words.json').words;
      this.word = this.words[this.randomN(0,this.words.length)]
    }
    /**
     * Starts The Game.
     */
async run() {
if(this.isSlash == true) {
  this.message.deferReply().catch(() => {});
}
const canvas = createCanvas(300,300);
const context = canvas.getContext('2d');
context.fillStyle ='#7d7c78'
registerFont('./assets/Roboto-Medium.ttf', {family:'Roboto'})
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
function wordEmbed(canvas,color,des) {
const image = new discord.AttachmentBuilder().setFile(canvas.toBuffer()).setName('wordle.png')
const embed = new discord.EmbedBuilder()
.setColor(color)
.setTitle("Wordle")
.setImage("attachment://wordle.png")
if(des) embed.setDescription(des)
return {embeds:[embed],files:[image] };
}
const msg = await this.edit(wordEmbed(canvas,"Yellow"),this.message)
const filter = m => m.author.id == this.player.id && m.content.length == 5 && /^[a-zA-Z]+$/.test(m.content);
const collector = this.message.channel.createMessageCollector({filter:filter,time:this.time,max:5})
collector.on('collect', m => {
  const attempt = m.content;
  const result = drawAndVerifyWord(this.word,attempt,chance)
  m.delete().catch(() => {})
  if(result == "win") {
    played = true;
    collector.stop()
    this.edit(wordEmbed(canvas,"Green","You Won!"),msg)
    return "win";
  }
  else {
    chance++
    if(chance == 5) {
      played = true;
      this.edit(wordEmbed(canvas,"Red","You Lost!, The word was "+this.word),msg)
      return "lose";
     }
    else {
    this.edit(wordEmbed(canvas,"Red"),msg)
    }
  }
})
collector.on('end', () => {
   if(played == false) {
    this.edit(wordEmbed(canvas,'Red','Game Over: Timed Out!'),msg)
    return "timeup";
   }
})
  }
}

module.exports = Wordle;