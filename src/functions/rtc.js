const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class RepeatTheColor{
  /**
   * Initialises a new instance of Repeat The Color Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {RepeatTheColor} Game instance.
   */

    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an Object");
      this.isSlash = gameOptions?.isSlash ?? false;
      if(this.isSlash == true) {
        if(!(this.message instanceof discord.CommandInteraction)){
        throw new TypeError("message must be an instance of Command Interaction") 
      }} else {
        if(!(this.message instanceof discord.Message)) {
          throw new TypeError("message must be an instance of Discord Message")
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
      this.onTimeUp = gameOptions?.onTimeUp ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a Funtion');
      if(this.onTimeUp && typeof this.onTimeUp !== 'function') throw new TypeError('onTimeUp must be a Function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a String');
      if(this.options?.startDes2 && typeof this.options?.startDes2 !== 'string') throw new TypeError('startDes2 must be a String');
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
function shuffleArray(lol) {
    let New = new Array().concat(lol)
    for (let i = New.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [New[i], New[j]] = [New[j], New[i]];
    }
    return New;
  }
const game = this;
function Embed(des,color) {
  return new EmbedBuilder()
  .setTitle(game.options?.title ?? "Repeat The Color")
  .setDescription(des)
  .setColor(color)
  .setTimestamp()
  .setFooter({text:`Requested by ${game.player.username}`})
  .setThumbnail(game.player.avatarURL());
}
const colors = ["red","blue","green","yellow","purple"]
const emojis = {
    "red":"🔴",
    "blue":"🔵",
    "yellow":"🟡",
    "green":"🟢",
    "purple":"🟣"
  }
const RandomColors = shuffleArray(colors)
const color1 = RandomColors[2];
const color2 = RandomColors[4];
const color3 = RandomColors[1];
const color4 = RandomColors[0];
const color5 = RandomColors[3];
var Row = new ActionRowBuilder();
for(var i in colors) {
const color = colors[i]
    const emoji = emojis[color]
Row.addComponents(new ButtonBuilder().setCustomId("rtc_"+color).setEmoji(emoji).setStyle(ButtonStyle.Secondary))
}
const msg = await this.edit({ embeds:[Embed(`${this.options?.startDes ?? `Remember the following Color Sequence`}\n ${emojis[`${color1}`]}${emojis[color2]}${emojis[color3]}${emojis[color4]}${emojis[color5]}`,'Green')]},this.message)
setTimeout(async () => {await this.edit({embeds:[Embed(this.options?.startDes2 ?? "Repeat the Color Sequence","Aqua" )],components:[Row]},msg)}, 5000)
const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: this.time });
let color = 1;
let played = false;
collector.on('collect', async i => {
	if (i.user.id === this.player.id) {
    await i.deferUpdate();
  if(i.customId.replace('rtc_','') == eval(`color${color}`)) {
    color++;
    Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true);
  if(color == 6) {
   this.edit({embeds:[Embed(this.options?.winDes ?? "You Won!","Yellow")],components:[Row]},msg);
   played = true;
   collector.stop();
   if(this.onWin) await this.onWin();
  }
  {
  await this.edit({components:[Row]},msg)
  }
  }
  else {
    await this.edit({embeds:[Embed(this.options?.loseDes ?? 'You Lost!, You failed to remember the Color Sequence','Red')]},msg)
    played = true;
    collector.stop()
    if(this.onLose) await this.onLose();
    }
    } else {
    await i.deferUpdate();
    }
 });

collector.on('end', async () => {
if(played == false) {
  await this.edit({embeds:[Embed(this.options?.timeUpDes ?? 'Game Over: Timed Out','Red')],components:[Row]},msg)
  if(this.onTimeUp) await this.onTimeUp();
}
 });
}
}

  module.exports = RepeatTheColor;