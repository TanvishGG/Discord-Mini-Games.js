const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class RockPaperScissors{
  /**
   * Initialises a new instance of Rock Paper Scissors Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The Game Options Object.
   * @returns {RockPaperScissors} Game instance.
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
              if(this.isSlash == true) return await replyMessage.editReply(messageOptions)
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
      this.onTimeUp = gameOptions?.onTimeUp ?? null;
      if(this.opponent && this.player.id == this.opponent.id) throw new Error('player and opponent cannot be same');
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a Funtion');
      if(this.onTie && typeof this.onTie !== 'function') throw new TypeError('onTie must be a Function');
      if(this.onTimeUp && typeof this.onTimeUp!== 'function') throw new TypeError('onTimeUp must be a Function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.options?.resTime && typeof this.options?.resTime !== 'number') throw new TypeError('resTime must be a Number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a String');
      if(this.options?.winDes && typeof this.options?.winDes !== 'string') throw new TypeError('winDes must be a String');
      if(this.options?.loseDes && typeof this.options?.loseDes !== 'string') throw new TypeError('loseDes must be a String');
      if(this.options?.timeUpDes && typeof this.options?.timeUpDes !== 'string') throw new TypeError('timeUpDes must be a String');
      if(this.options?.confirmDes && typeof this.options?.confirmDes !== 'string') throw new TypeError('confirmDes must be a String');
      if(this.options?.declineDes && typeof this.options?.declineDes !== 'string') throw new TypeError('declineDes must be a String');
      if(this.options?.noResDes && typeof this.options?.noResDes !== 'string') throw new TypeError('noResDes must be a String');
      if(this.options?.tieDes && typeof this.options?.tieDes !== 'string') throw new TypeError('tieDes must be a String');
    }
 /**
  * Starts the game
  */
async run() {
  if(this.isSlash == true) {
   await this.message.deferReply();
  }
const game = this;
function Embed(des,color) {
 return new EmbedBuilder()
 .setTitle(game.options?.title ?? 'Rock Paper Scissors')
 .setDescription(des)
 .setTimestamp()
 .setFooter({text:game.opponent ? `${game.player.username} vs ${game.opponent.username}` : `Requested by ${game.player.username}`})
 .setColor(color)
 .setThumbnail(game.player.avatarURL())
}
  if(!this.opponent) {
  var Row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rps_rock').setStyle(ButtonStyle.Secondary).setEmoji('🪨'),
    new ButtonBuilder().setCustomId('rps_paper').setStyle(ButtonStyle.Secondary).setEmoji('📜'),
    new ButtonBuilder().setCustomId('rps_scissor').setStyle(ButtonStyle.Secondary).setEmoji('✂️')
    )
 const msg = await this.edit({embeds:[Embed(this.options?.startDes ?? 'Choose your option','Aqua')], components:[Row]},this.message)
 try {
  const filter = (i) => i.user.id == this.player.id;
  const i = await msg.awaitMessageComponent({filter:filter, time:this.time});
  let played = false;
  const bot = this.choices[this.randomN(0,2)];
  await i.deferUpdate();
if(i.user.id == this.player.id) {
   played = true;
   Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
   if(this.win[`${bot}`] == i.customId.replace('rps_','')) {
     await this.edit({embeds:[Embed(this.options?.winDes?.replace(/{user_option}/g,this.emojis[i.customId.replace('rps_','')])?.replace(/{bot_option}/g,this.emojis[bot]) ?? `You Won!, Your choice: ${this.emojis[`${i.customId.replace('rps_','')}`]}, My Choice: ${this.emojis[`${bot}`]}`,'Yellow')],components:[Row]},msg)
     if(this.onWin) await await this.onWin();
   }
   else {
     if(i.customId.replace('rps_','') == bot) {
     await this.edit({embeds:[Embed(this.options?.tieDes?.replace(/{user_option}/g,this.emojis[i.customId.replace('rps_','')])?.replace(/{bot_option}/g,this.emojis[bot]) ?? `Game Tied!, Our Choice: ${this.emojis[`${bot}`]}`,'Red')],components:[Row]},msg)
     if(this.onTie) await this.onTie();
     } else {
     await this.edit({embeds:[Embed(this.options?.loseDes?.replace(/{bot_option}/g,this.emojis[bot])?.replace(/{user_option}/g,this.emojis[i.customId.replace('rps_','')]) ?? `You Lost!, Your choice: ${this.emojis[`${i.customId}`]}, My Choice: ${this.emojis[`${bot}`]}`,'Red')],components:[Row]},msg)
     if(this.onLose) await this.onLose();
     }}
 }
  }
  catch(e) {
   Row.components.forEach(x => x.setDisabled(true))
   await this.edit({embeds:[Embed(this.options?.timeUpDes ?? 'Game Ended: Timed Out','Red')],components:[Row]},msg);
   if(this.onTimeUp) await this.onTimeUp();
 }
}
else {
const msg = await this.edit({content:`${this.opponent}`,embeds:[Embed(this.options?.confirmDes ?? `${this.player} has challenged you for a game of Rock Paper Scissors`,'Aqua')],
components:[new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('rps_yes').setLabel('Accept').setStyle(ButtonStyle.Success),
  new ButtonBuilder().setCustomId('rps_no').setLabel('Decline').setStyle(ButtonStyle.Danger))
]},this.message)
const filter = (i) => i.user.id == this.opponent.id
try {
const i = await msg.awaitMessageComponent({filter:filter,time:this.options?.resTime ?? 30000})
await i.deferUpdate();
if(i.customId == "rps_yes") {
  var Row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rps_rock').setStyle(ButtonStyle.Secondary).setEmoji("🪨"),
    new ButtonBuilder().setCustomId('rps_paper').setStyle(ButtonStyle.Secondary).setEmoji("📜"),
    new ButtonBuilder().setCustomId('rps_scissor').setStyle(ButtonStyle.Secondary).setEmoji("✂️")
  )
await this.edit({content:"",embeds: [Embed(this.options?.startDes ?? 'Choose your option','Aqua') ],components:[Row]},msg)
let op = {played:false,choice:null};
let p = {played:false,choice:null};
const filter2 = (i) => i.user.id == this.opponent.id || i.user.id == this.player.id
const collector = msg.createMessageComponentCollector({filter:filter2,ComponentType:ComponentType.Button,idle:this.time})
collector.on('collect', async i => {
  await i.deferUpdate();
if(i.user.id == this.player.id && p.played==false) {
  p.played = true;
  p.choice = i.customId.replace('rps_','');
}
if(i.user.id == this.opponent.id && op.played==false) {
  op.played = true;
  op.choice = i.customId.replace('rps_','');
}
if(p.played == true && op.played == true) {
  var string = "";
  var status = {}
  collector.stop();
  if(op.choice == p.choice) {
    string = this.options?.tieDes?.replace(/{option}/g,this.emojis[p.choice]) ?? `Game Tied! \nBoth choose ${this.emojis[p.choice]}`;
  }
  if(op.choice == this.win[p.choice]) { 
    string = this.options?.winDes?.replace(/{winner}/g,`${this.opponent}`)?.replace(/{loser}/g,`${this.player}`)?.replace(/{winner_choice}/g,this.emojis[op.choice])?.replace(/{loser_choice}/g,this.emojis[p.choice]) ?? `${this.opponent} Won! \n${this.emojis[op.choice]} beats ${this.emojis[p.choice]}`;status = {winner:this.opponent,loser:this.player}
  }
  if(this.win[op.choice] == p.choice) { 
    string = this.options?.winDes?.replace(/{winner}/g,`${this.player}`)?.replace(/{loser}/g,`${this.opponent}`)?.replace(/{winner_choice}/g,this.emojis[p.choice])?.replace(/{loser_choice}/g,this.emojis[op.choice]) ?? `${this.player} Won! \n${this.emojis[p.choice]} beats ${this.emojis[op.choice]}`;status = {winner:this.player,loser:this.opponent}
  }
  await this.edit({embeds:[Embed(string,'Green')],components:[]},msg)
  if(op.choice == p.choice && this.onTie) await this.onTie();
  else if(this.onWin) await this.onWin(status.winner,status.loser);
}
})
collector.on('end', async () => {
  if(p.played == true && op.played == true) return;
  const notplayed = p.played == true ? this.opponent : this.player;
  await this.edit({embeds: [Embed(this.options?.timeUpDes?.replace(/{timed_player}/g,notplayed) ?? `Game Ended: ${notplayed} took too long to respond`,'Red')],components:[]},msg)
  if(this.onTimeUp) await this.onTimeUp(notplayed, p.played == true ? this.player : this.opponent);
})
}
else {
  await this.edit({content:"",embeds: [Embed(this.options?.declineDes ?? `${this.opponent} has declined your challenge`,'Red')], components:[]},msg)
}
}
catch(e) {
 await this.edit({content:"", embeds: [Embed(this.options?.noResDes ?? `${this.opponent} did not respond in time`,'Red')], components:[]},msg)
}
}
}
}

module.exports = RockPaperScissors;