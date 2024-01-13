const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class RepeatTheColor{
  /**
   * Initialises a new instance of Repeat The Color Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {RepeatTheColor} Game instance.
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
  function shuffleArray(lol) {
    let New = new Array().concat(lol)
    for (let i = New.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [New[i], New[j]] = [New[j], New[i]];
    }
    return New;
  }
const colors = ["red","blue","green","yellow","purple"]
const emojis = {
    "red":"🔴",
    "blue":"🔵",
    "yellow":"🟡",
    "green":"🟢",
    "purple":"🟣"}
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
Row.addComponents(new ButtonBuilder().setCustomId(color).setCustomId(color).setEmoji(emoji).setStyle(ButtonStyle.Primary))
}

const embed = new EmbedBuilder()
.setTitle(this.options?.title ?? "Repeat The Color")
.setDescription(`${this.options?.startDes ?? `Remember the below color sequence`}\n ${emojis[`${color1}`]}${emojis[color2]}${emojis[color3]}${emojis[color4]}${emojis[color5]}`)
.setColor('Green');
const msg = await this.edit({embeds:[embed]},this.message)
const EditEmbed = new EmbedBuilder()
.setTitle(this.options?.title ?? "Repeat The Color")
.setDescription(this.options?.startDes2 ?? "Now repeat the color sequence")
.setColor('Green');
setTimeout(() => {this.edit({embeds:[EditEmbed],components:[Row]},msg)}, 5000)
const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });
let color = 1;
let played = false;
collector.on('collect', async i => {
	if (i.user.id === this.player.id) {
    i.deferUpdate();
  if(i.customId == eval(`color${color}`)) {
    color++;
  Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
  if(color == 6) {
   this.edit({embeds:[new EmbedBuilder().setTitle(this.options?.winDes ?? "Repeat The Color").setDescription("You Won!").setColor("Yellow")],components:[Row]},msg)
   played = true;
   collector.stop();
   if(this.onWin) await this.onWin();
  }
  {
  this.edit({components:[Row]},msg)
  }
  }
  else {
    this.edit({embeds:[new EmbedBuilder().setTitle(this.options?.title ?? "Repeat The Color").setDescription(this.options?.loseDes ?? 'You Lost!, You failed to remember the color sequence').setColor('Red')]},msg)
    played = true;
    collector.stop()
 if(this.onLose) await this.onLose();
  }
  } else {
  	i.deferUpdate();
    }
 });

collector.on('end', collected => {
if(played == false) {
  this.edit({embeds:[new EmbedBuilder().setTitle(this.options?.title ?? "Repeat The Color").setDescription(this.options?.timeUpDes ?? 'Game Over: Timed Out').setColor('Red')],components:[Row]},msg)
}
 });
}

  }

  module.exports = RepeatTheColor;