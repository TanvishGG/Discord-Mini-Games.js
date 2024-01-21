const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class TicTacToe{
  /**
   * Initialises a new instance of Tic Tac Toe Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The Game Options Object.
   * @returns {TicTacToe} Game instance.
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
      if(!this.opponent) throw new Error("Opponent is not provided");
      if(this.opponent && !(this.opponent instanceof discord.User)) {
      throw new TypeError("opponent must be an instance of Discord User");
      }
      this.time = gameOptions?.time ?? 120000;
      this.replied = false;
      this.randomN = (min,max) => {return Math.floor(Math.random()*max)+min;}
      this.edit = async (messageOptions,replyMessage) => {
          messageOptions.fetchReply = true;
           if(this.replied == false) {
              this.replied=true; 
              if(this.isSlash == true) return replyMessage.editReply(messageOptions)
              return await this.message.reply(messageOptions);}
              else return await replyMessage.edit(messageOptions)
           }
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onTie = gameOptions?.onTie ?? null;
      this.onTimeUp = gameOptions?.onTimeUp ?? null;
      if(this.player.id == this.opponent.id) throw new Error("player and opponent cannot be same");
      if(this.options?.playerEmoji && typeof this.options?.playerEmoji !== 'string') throw new TypeError('playerEmoji must be a String');
      if(this.options?.opEmoji && typeof this.options?.opEmoji !== 'string') throw new TypeError('opEmoji must be a String');
      if(this.options?.emptyEmoji && typeof this.options?.emptyEmoji !== 'string') throw new TypeError('emptyEmoji must be a String');
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.onTie && typeof this.onTie !== 'function') throw new TypeError('onTie must be a Function');
      if(this.onTimeUp && typeof this.onTimeUp !== 'function') throw new TypeError('onTimeUp must be a Function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a Number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
      if(this.options?.startDes && typeof this.options?.startDes !== 'string') throw new TypeError('startDes must be a String');
      if(this.options?.winDes && typeof this.options?.winDes !== 'string') throw new TypeError('winDes must be a String');
      if(this.options?.retryDes && typeof this.options?.retryDes !== 'string') throw new TypeError('retryDes must be a String');
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
    .setDescription(des)
    .setColor(color)
    .setTimestamp()
    .setThumbnail(game.player.avatarURL())
    .setTitle(game.options?.title ?? "Tic Tac Toe")
    .setFooter({text:game.options?.footer ?? `${game.player.username} vs ${game.opponent.username}`})
  }
  function verifyGame(board) {
    const win = [
      ['00','01','02'],
      ['10','11','12'],
      ['20','21','22'],
      ['00','10','20'],
      ['01','11','21'],
      ['02','12','22'],
      ['00','11','22'],
      ['02','11','20']
    ]
    for (let i = 0; i < win.length; i++) {
      const [a,b,c] = win[i];
      if(!board.get(a) || !board.get(b) || !board.get(c)) continue;
      if(board.get(a) == board.get(b) && board.get(b) == board.get(c)) return 'win';
    }
    return board.size == 9 ? 'tie' : 'continue';
  }
 const msg = await this.edit({content:`${this.opponent}`,embeds:[Embed(this.options?.confirmDes ?? `${this.player} has challenged you to a game of Tic Tac Toe`,'Aqua')],
components:[
  new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('yes').setLabel('Accept').setStyle(ButtonStyle.Success),
  new ButtonBuilder().setCustomId('no').setLabel('Decline').setStyle(ButtonStyle.Danger))
]},this.message)
const filter = (i) => i.user.id == this.opponent.id
try { 
var gameBoard = new discord.Collection();
var played = false;
const i = await msg.awaitMessageComponent({filter:filter,time:this.options?.resTime ?? 30000})
i.deferUpdate();
let emojis = {};
function Buttons(x,y,z) {
  return new ButtonBuilder()
  .setCustomId(x)
  .setEmoji(y ?? game.options?.emptyEmoji ?? "◼️")
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(z ?? false)
}
if(i.customId == "yes") {
  var Rows = [ 
    new ActionRowBuilder().addComponents(Buttons('ttt_00'),Buttons('ttt_01'),Buttons('ttt_02')),
    new ActionRowBuilder().addComponents(Buttons('ttt_10'),Buttons('ttt_11'),Buttons('ttt_12')),
    new ActionRowBuilder().addComponents(Buttons('ttt_20'),Buttons('ttt_21'),Buttons('ttt_22'))
  ]
  emojis[this.player.id] = this.options?.playerEmoji ?? "❌";
  emojis[this.opponent.id] = this.options?.opEmoji ?? "🟢";
  var chances = [[this.player,this.opponent],[this.opponent,this.player]][this.randomN(0,1)]
  await this.edit({content:"",embeds: [ Embed(this.options?.startsDes ?? `${emojis[chances[0].id]} ${chances[0]}'s turn`,'Aqua')],components:Rows},msg)
  const filter2 = (i) => i.user.id == this.opponent.id || i.user.id == this.player.id
  const collector = msg.createMessageComponentCollector({filter:filter2,ComponentType:ComponentType.Button,idle:this.time})
collector.on('collect', async i => {
  await i.deferUpdate();
  if(i.user.id !== chances[0].id) return;
  Rows[i.customId[4]].components.find(x => x.data.custom_id == i.customId).setStyle(i.user.id == this.player.id ? ButtonStyle.Danger : ButtonStyle.Success).setEmoji(emojis[i.user.id]).setDisabled(true)
  gameBoard.set(i.customId.replace('ttt_',''),i.user.id)
  chances = chances.reverse();
  const wonGame = verifyGame(gameBoard);
  if(wonGame == 'continue') {
  await this.edit({embeds: [ Embed(this.options?.retryDes?.replace(/{next_player}/g,chances[0])?.replace(/{emoji}/g,`${emojis[chances[0].id]}`) ?? `${emojis[chances[0].id]} ${chances[0]}'s turn`,'Aqua')],components:Rows},msg)
  }
  if(wonGame == 'win') {
    played = true;
    collector.stop();
    await this.edit({embeds: [Embed(this.options?.winDes?.replace(/{winner}/g,i.user)?.replace(/{emoji}/g,emojis[i.user.id]) ?? `${emojis[i.user.id]} ${i.user} Won!`,'Green')],components:Rows},msg)
    if(this.onWin) await this.onWin(i.user,this.player.id == i.user.id ? this.opponent : this.player)
  }
if(wonGame == 'tie') {
  played = true;
  collector.stop();
  await this.edit({embeds: [Embed(this.options?.tieDes ?? 'Game Tied','Yellow')],components:Rows},msg);
  if(this.onTie) await this.onTie();
}
})
collector.on('end', async () => {
  if(played == true) return;
  await this.edit({embeds: [Embed(this.options?.timeUpDes?.replace(/{timed_player}/g,chances[0])?.replace(/{emoji}/g,emojis[chances[0].id]) ?? `Game Ended: ${emojis[chances[0].id]} ${chances[0]} took too long to respond`,'Red')]},msg)
  if(this.onTimeUp) await this.onTimeUp(chances[0], chances[1]);
})
}
else {
  await this.edit({ content:"", embeds:[ Embed(this.options?.declineDes ?? `${this.opponent} has declined your challenge`,'Red')],components:[]},msg)
}
}
catch(e) {
  await this.edit({ content:"", embeds: [ Embed(this.options?.noResDes ?? `${this.opponent} did not respond in time`,'Red')],  components:[]},msg)
}
}
}


module.exports = TicTacToe;