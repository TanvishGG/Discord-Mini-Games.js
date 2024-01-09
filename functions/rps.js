const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class RockPaperScissors {
  /**
   * Initialises a new instance of rock paper scissors game
   * @param {`Message/Interaction`} message The message object
   * @param {`GameOptions-Object`} gameOptions The game Options Object
   * @returns {RockPaperScissors} Game instance
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
      this.opponent = gameOptions?.opponent ?? null;
      if(this.opponent && !(this.opponent instanceof discord.User)) {
      throw new TypeError("opponent must be an instance of Discord User");
      }
      this.time = gameOptions?.time ?? 30000;
      this.replied = false;
      this.edit = async (messageOptions,replyMessage) => {
        if(this.isSlash == true) {
          messageOptions.fetchReply = true;
          return await replyMessage.editReply(messageOptions)
        }
        else {
          if(this.replied == false) {this.replied=true; return await this.message.reply(messageOptions);}
          else return await replyMessage.edit(messageOptions)
        }
      }
      this.emojis = {
        "rock":"🪨",
        "paper":"📜",
        "scissor":"✂️"
      }
      this.win = {
        "rock":"paper",
        "paper":"scissor",
        "scissor":"rock"
      }
      this.choices = ['rock','paper','scissor']

    }
 /**
  * Starts the game
  */
async run() {
  if(this.isSlash == true) {
    this.message.deferReply();
  }
  if(!this.opponent) {
  var Row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('rock').setStyle(ButtonStyle.Secondary).setEmoji('🪨'),
  new ButtonBuilder().setCustomId('paper').setStyle(ButtonStyle.Secondary).setEmoji('📜'),
  new ButtonBuilder().setCustomId('scissor').setStyle(ButtonStyle.Secondary).setEmoji('✂️'))
  const embed = new EmbedBuilder()
  .setTitle("Rock Paper Scisscors")
  .setDescription("Choose your choice")
  .setColor("Green")
  .setThumbnail(this.player.avatarURL())
 const msg = await this.edit({embeds:[embed], components:[Row]},this.message)
 try {
  const filter = (i) => i.user.id == this.player.id
 const i = msg.awaitMessageComponent({filter:filter, time:30000})
 let played = false
 const bot = this.choices[randomN(0,2)]
  i.deferUpdate()
if(i.user.id == this.player.id) {
   played = true
   collector.stop()
   Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
   if(this.win[`${bot}`] == i.customId) {
     await this.edit({embeds:[new EmbedBuilder().setThumbnail(this.player.avatarURL()).setTitle("Rock Paper Scissors").setDescription(`You Won!, Your choice: ${this.emojis[`${i.customId}`]}, My Choice: ${this.emojis[`${bot}`]}`)],components:[Row]},msg)
   }
   else {
     if(i.customId == bot) {
     await this.edit({embeds:[new EmbedBuilder().setThumbnail(this.player.avatarURL()).setTitle("Rock Paper Scissors").setDescription(`Game Tied!, Our Choice: ${this.emojis[`${bot}`]}`)],components:[Row]},msg)
     } else {
     await this.edit({embeds:[new EmbedBuilder().setTitle("Rock Paper Scissors").setDescription(`You Lost!, Your choice: ${this.emojis[`${i.customId}`]}, My Choice: ${this.emojis[`${bot}`]}`).setThumbnail(this.player.avatarURL())],components:[Row]},msg)
     }}
 }
  }
  catch(e) {
   Row.components.forEach(x => x.setDisabled(true))
   this.edit({embeds:[new EmbedBuilder().setTitle("Rock Paper Scissors").setDescription('Game Ended: Timed Out').setThumbnail(this.player.avatarURL()).setColor('Red')],components:[Row]},msg)
 }
}
else {
 const msg = await this.edit({content:this.opponent,embeds:[
  new EmbedBuilder().setTitle("Rock Paper Scissors").setDescription(`${this.player} has challenged you to a game of Rock Paper Scissors`).setColor('Navy')
 ],
components:[new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('yes').setLabel('Accept').setStyle(ButtonStyle.Success),
  new ButtonBuilder().setCustomId('no').setLabel('Decline').setStyle(ButtonStyle.Danger))
]},this.message)
const filter = (i) => i.user.id == this.opponent.id
try {
const i = await msg.awaitMessageComponent({filter:filter,time:this.time})
i.deferUpdate();
if(i.customId == "yes") {
  var Row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rock').setStyle(ButtonStyle.Secondary).setEmoji("🪨"),
    new ButtonBuilder().setCustomId('paper').setStyle(ButtonStyle.Secondary).setEmoji("📜"),
    new ButtonBuilder().setCustomId('scissor').setStyle(ButtonStyle.Secondary).setEmoji("✂️")
  )
this.edit({
  content:"",
  embeds: [
    new EmbedBuilder()
    .setTitle('Rock Paper Scissors')
    .setDescription('Choose your choice')
    .setColor('Aqua')
  ],
  components:[Row]
},msg)
let op = {played:false,choice:null};
let p = {played:false,choice:null};
const filter2 = (i) => i.user.id == this.opponent.id || i.user.id == this.player.id
const collector = msg.createMessageComponentCollector({filter:filter2,ComponentType:ComponentType.Button,time:this.time})
collector.on('collect', async i => {
  i.deferUpdate();
if(i.user.id == this.player.id && p.played==false) {
p.played = true;
p.choice = i.customId;
}
if(i.user.id == this.opponent.id && op.played==false) {
  op.played = true;
  op.choice = i.customId;
}
if(p.played == true && op.played == true) {
var string = "";
collector.stop();
if(op.choice == p.choice) { string = `Game Tied! Both choose ${this.emojis[p.choice]}`}
if(op.choice == this.win[p.choice]) { string = `${this.opponent} Won! ${this.emojis[op.choice]} beats ${this.emojis[p.choice]}`}
if(win[op.choice] == p.choice) { string = `${this.player} Won! ${this.emojis[p.choice]} beats ${this.emojis[op.choice]}`}
this.edit({
  embeds:[
    new EmbedBuilder().setTitle('Rock Paper Scissors')
    .setDescription(string).setColor('Green')],
    components:[]
})
}
})
collector.on('end', async() => {
  if(p.played == true && op.played == true) return;
  this.edit({embeds: [
    new EmbedBuilder()
    .setDescription(`Game Ended: Timed Out`)
    .setColor('Red')
    .setTitle('Rock Paper Scissors')
  ],components:[]},msg)
})
}
else {
  this.edit({
  content:"",
  embeds:[
    new EmbedBuilder()
    .setTitle('Rock Paper Scissors')
    .setDescription(`${this.opponent} has declined your challenge`)
    .setColor('Red')
  ]
  },msg)
}
}
catch(e) {
  this.edit({
    content:"",
    embeds: [
    new EmbedBuilder()
    .setTitle('Rock Paper Scissors')
    .setDescription(`${this.opponent} did not respond in time`)
    .setColor('Red')],
   components:[]},msg)
}
}
}
}

module.exports = RockPaperScissors;