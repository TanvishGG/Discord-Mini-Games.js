const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class RockPaperScissors{
  /**
   * Initialises a new instance of Rock Paper Scissors Game.
   * @param {`Message/Interaction`} message The Message object.
   * @param {`GameOptions-Object`} gameOptions The Game Options Object.
   * @returns {RockPaperScissors} Game instance.
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
      this.opponent = gameOptions?.opponent ?? null;
      if(this.opponent && !(this.opponent instanceof discord.User)) {
      throw new TypeError("opponent must be an instance of Discord User");
      }
      this.time = gameOptions?.time ?? 30000;
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
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      this.onTie = gameOptions?.onTie ?? null;
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a funtion');
      if(this.onTie && typeof this.onTie !== 'function') throw new TypeError('onTie must be a function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a string');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a string');
      if(this.options?.winDes && typeof this.options?.winDes !== 'string') throw new TypeError('winDes must be a string');
      if(this.options?.loseDes && typeof this.options?.loseDes !== 'string') throw new TypeError('loseDes must be a string');
      if(this.options?.timeUpDes && typeof this.options?.timeUpDes !== 'string') throw new TypeError('timeUpDes must be a string');
      if(this.options?.confirmDes && typeof this.options?.confirmDes !== 'string') throw new TypeError('confirmDes must be a string');
      if(this.options?.declineDes && typeof this.options?.declineDes !== 'string') throw new TypeError('declineDes must be a string');
      if(this.options?.noResDes && typeof this.options?.noResDes !== 'string') throw new TypeError('noResDes must be a string');
      if(this.options?.tieDes && typeof this.options?.tieDes !== 'string') throw new TypeError('tieDes must be a string');
    }
 /**
  * Starts the game
  */
async run() {
  if(this.isSlash == true) {
   await this.message.deferReply();
  }
  if(!this.opponent) {
  var Row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('rock').setStyle(ButtonStyle.Secondary).setEmoji('🪨'),
  new ButtonBuilder().setCustomId('paper').setStyle(ButtonStyle.Secondary).setEmoji('📜'),
  new ButtonBuilder().setCustomId('scissor').setStyle(ButtonStyle.Secondary).setEmoji('✂️'))
  const embed = new EmbedBuilder()
  .setTitle(this.options?.title ?? "Rock Paper Scisscors")
  .setDescription(this.options?.startDes ?? "Choose your choice")
  .setColor("Green")
  .setThumbnail(this.player.avatarURL())
 const msg = await this.edit({embeds:[embed], components:[Row]},this.message)
 try {
  const filter = (i) => i.user.id == this.player.id
 const i = await msg.awaitMessageComponent({filter:filter, time:this.time})
 let played = false
 const bot = this.choices[this.randomN(0,2)]
  i.deferUpdate()
if(i.user.id == this.player.id) {
   played = true
   Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
   if(this.win[`${bot}`] == i.customId) {
     await this.edit({embeds:[new EmbedBuilder().setThumbnail(this.player.avatarURL()).setTitle(this.options?.title ?? "Rock Paper Scissors").setDescription(this.options?.winDes?.replace(/{user_option}/g,this.emojis[i.customId])?.replace(/{bot_option}/g,this.emojis[bot]) ?? `You Won!, Your choice: ${this.emojis[`${i.customId}`]}, My Choice: ${this.emojis[`${bot}`]}`)],components:[Row]},msg)
     if(this.onWin) await await this.onWin();
   }
   else {
     if(i.customId == bot) {
     await this.edit({embeds:[new EmbedBuilder().setThumbnail(this.player.avatarURL()).setTitle(this.options?.title ?? "Rock Paper Scissors").setDescription(this.options?.tieDes?.replace(/{user_option}/g,this.emojis[i.customId])?.replace(/{bot_option}/g,this.emojis[bot]) ?? `Game Tied!, Our Choice: ${this.emojis[`${bot}`]}`)],components:[Row]},msg)
     if(this.onTie) await this.onTie();
     } else {
     await this.edit({embeds:[new EmbedBuilder().setTitle(this.options?.title ?? "Rock Paper Scissors").setDescription(this.options?.loseDes?.replace(/{bot_option}/g,this.emojis[bot])?.replace(/{user_option}/g,this.emojis[i.customId]) ?? `You Lost!, Your choice: ${this.emojis[`${i.customId}`]}, My Choice: ${this.emojis[`${bot}`]}`).setThumbnail(this.player.avatarURL())],components:[Row]},msg)
     if(this.onLose) await this.onLose();
     }}
 }
  }
  catch(e) {
   Row.components.forEach(x => x.setDisabled(true))
   this.edit({embeds:[new EmbedBuilder().setTitle(this.options?.title ?? "Rock Paper Scissors").setDescription(this.options?.timeUpDes ?? 'Game Ended: Timed Out').setThumbnail(this.player.avatarURL()).setColor('Red')],components:[Row]},msg)
   return "timeup"
 }
}
else {
 const msg = await this.edit({content:this.opponent,embeds:[
  new EmbedBuilder().setTitle(this.options?.title ?? "Rock Paper Scissors").setDescription(this.options?.confirmDes ?? `${this.player} has challenged you to a game of Rock Paper Scissors`).setColor('Navy')
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
    .setTitle(this?.options?.title ?? 'Rock Paper Scissors')
    .setDescription(this.options?.startDes ?? 'Choose your choice')
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
var status = {}
collector.stop();
if(op.choice == p.choice) { string = this.options?.tieDes?.replace(/{option}/g,this.emojis[p.choice]) ?? `Game Tied! Both choose ${this.emojis[p.choice]}`;}
if(op.choice == this.win[p.choice]) { string = this.options?.winDes?.replace(/{winner}/g,`${this.opponent}`)?.replace(/{loser}/g,`${this.player}`)?.replace(/{winner_choice}/g,this.emojis[op.choice])?.replace(/{loser_choice}/g,this.emojis[p.choice]) ?? `${this.opponent} Won! ${this.emojis[op.choice]} beats ${this.emojis[p.choice]}`;status = {winner:this.opponent,loser:this.player}}
if(win[op.choice] == p.choice) { string = this.options?.winDes?.replace(/{winner}/g,`${this.player}`)?.replace(/{loser}/g,`${this.opponent}`)?.replace(/{winner_choice}/g,this.emojis[p.choice])?.replace(/{loser_choice}/g,this.emojis[op.choice]) ?? `${this.player} Won! ${this.emojis[p.choice]} beats ${this.emojis[op.choice]}`;status = {winner:this.player,loser:this.opponent}}
this.edit({
  embeds:[
    new EmbedBuilder().setTitle(this.options?.title ?? 'Rock Paper Scissors')
    .setDescription(string).setColor('Green')],
    components:[]
})
if(op.choice == p.choice && this.onTie) await this.onTie();
else if(this.onWin) await this.onWin(status.winner,status.loser);
}
})
collector.on('end', async() => {
  if(p.played == true && op.played == true) return;
  this.edit({embeds: [
    new EmbedBuilder()
    .setDescription(this.options?.timeUpDes ?? `Game Ended: Timed Out`)
    .setColor('Red')
    .setTitle(this.options?.title ?? 'Rock Paper Scissors')
  ],components:[]},msg)
})
}
else {
  this.edit({
  content:"",
  embeds:[
    new EmbedBuilder()
    .setTitle(this.options?.title ?? 'Rock Paper Scissors')
    .setDescription(this.options?.declineDes ?? `${this.opponent} has declined your challenge`)
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
    .setTitle(this.options?.title ?? 'Rock Paper Scissors')
    .setDescription(this.options?.noResDes ?? `${this.opponent} did not respond in time`)
    .setColor('Red')],
   components:[]},msg)
}
}
}
}

module.exports = RockPaperScissors;