const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js');
const { random, gammaDependencies, rowTransformDependencies } = require('mathjs');
class Connect4{
  /**
   * Initialises a new instance of Connect4 Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The Game Options Object.
   * @returns {Connect4} Game instance.
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
      this.options = gameOptions;
      this.onWin = gameOptions?.onWin ?? null;
      this.onTie = gameOptions?.onTie ?? null;
      this.onTimeUp = gameOptions?.onTimeUp ?? null;
      this.board = [];
      if(this.opponent && this.player.id == this.opponent.id) throw new Error('player and opponent cannot be same');
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.options?.emoji1 && typeof this.options?.emoji1 !== 'string') throw new TypeError('emoji1 must be a String');
      if(this.options?.emoji2 && typeof this.options?.emoji2 !== 'string') throw new TypeError('emoji2 must be a String');
      if(this.options?.emptyEmoji && typeof this.options?.emptyEmoji !== 'string') throw new TypeError('emptyEmoji must be a String');
      if(this.onTie && typeof this.onTie !== 'function') throw new TypeError('onTie must be a Function');
      if(this.onTimeUp && typeof this.onTimeUp!== 'function') throw new TypeError('onTimeUp must be a Function');
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(typeof this.time !== 'number') throw new TypeError('time must be a number');
      if(this.options?.resTime && typeof this.options?.resTime !== 'number') throw new TypeError('resTime must be a Number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
      if(this.options?.winDes && typeof this.options?.winDes !== 'string') throw new TypeError('winDes must be a String');
      if(this.options?.tieDes && typeof this.options?.tieDes !== 'string') throw new TypeError('tieDes must be a String');
      if(this.options?.nextDes && typeof this.options?.nextDes !== 'string') throw new TypeError('nextDes must be a String');
      if(this.options?.timeUpDes && typeof this.options?.timeUpDes !== 'string') throw new TypeError('timeUpDes must be a String');
      if(this.options?.confirmDes && typeof this.options?.confirmDes !== 'string') throw new TypeError('confirmDes must be a String');
      if(this.options?.declineDes && typeof this.options?.declineDes !== 'string') throw new TypeError('declineDes must be a String');
      if(this.options?.noResDes && typeof this.options?.noResDes !== 'string') throw new TypeError('noResDes must be a String');
    }
 /**
  * Starts the game
  */
async run() {
  if(this.isSlash == true) {
   await this.message.deferReply();
  }
let game = this;
for(let y = 0; y < 6; y++) {
  for(let x = 0; x < 7; x++) {
    game.board[y * 7 + x] = game.options?.emptyEmoji ?? "⬛";
  }
}
function Embed(des,color,status) {
 const embed = new EmbedBuilder()
 .setTitle(game.options?.title ?? 'Connect4')
 .setDescription(des)
 .setTimestamp()
 .setFooter({text:game.opponent ? `${game.player.username} vs ${game.opponent.username}` : `Requested by ${game.player.username}`})
 .setColor(color)
 .setThumbnail(game.player.avatarURL())
 if(status) embed.addFields({name:'Status',value:status,inline:false})
 return embed;
}
const msg = await this.edit({content:`${this.opponent}`,embeds:[Embed(this.options?.confirmDes ?? `${this.player} has challenged you for a game of Connect4`,'Aqua')],
components:[new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId('c4_yes').setLabel('Accept').setStyle(ButtonStyle.Success),
  new ButtonBuilder().setCustomId('c4_no').setLabel('Decline').setStyle(ButtonStyle.Danger))
]},this.message)
const filter = (i) => i.user.id == this.opponent.id
try {
const i = await msg.awaitMessageComponent({filter:filter,time:this.options?.resTime ?? 30000})
await i.deferUpdate();
if(i.customId == "c4_yes") {    

function genBoard() {
    let temp = '';
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 7; x++) {
        temp += game.board[y * 7 + x];
          }
      temp += '\n';
        }
    temp += '1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣';
    return temp;
}
function verifyGame(X,Y,emoji) {
    for (let i = Math.max(0, X - 3); i <= X; i++) {
      const next = i + (Y * 7);
      if (i + 3 < 7) {
        if (game.board[next] == emoji && game.board[next + 1] == emoji && game.board[next + 2] == emoji && game.board[next + 3] == emoji) return true;
      }
    }
    for (let i = Math.max(0, Y - 3); i <= Y; i++) {
      const next = X + (i * 7);
      if (i + 3 < 6) {
        if (game.board[next] == emoji && game.board[next + 7] == emoji && game.board[next + (2*7)] == emoji && game.board[next + (3*7)] == emoji) return true;
      }
    }
    for (let i = -3; i <= 0; i++) {
      const block = { x: X + i, y: Y + i };
      const next = block.x + (block.y * 7);
      if ((block.x + 3) < 7 && (block.y + 3) < 6) {
        if (game.board[next] == emoji && game.board[next +(7)+ 1] == emoji && game.board[next +(2*7)+ 2] == emoji && game.board[next +(3*7)+ 3] == emoji) return true;
      }
    }
    for (let i = -3; i <= 0; i++) {
      const block = { x: X + i, y: Y - i };
      const next = block.x + (block.y * 7);
      if ((block.x + 3) < 7 && (block.y - 3) >= 0 && block.x >= 0) {
        if (game.board[next] == emoji && game.board[next -(7)+ 1] == emoji && game.board[next -(2*7)+ 2] == emoji && game.board[next -(3*7)+ 3] == emoji) return true;
      }
    }
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 7; x++) {
          if (game.board[y * 7 + x] == (game.options?.emptyEmoji ?? "⬛")) return false;
        }
      }
    return 'tie';
  }
const Rows = [ new ActionRowBuilder().addComponents(
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('1️⃣').setCustomId('c4_1'),
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('2️⃣').setCustomId('c4_2'),
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('3️⃣').setCustomId('c4_3'),
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('4️⃣').setCustomId('c4_4'),
   ),
     new ActionRowBuilder().addComponents(
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('5️⃣').setCustomId('c4_5'),
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('6️⃣').setCustomId('c4_6'),
     new ButtonBuilder().setStyle(ButtonStyle.Secondary).setEmoji('7️⃣').setCustomId('c4_7'),
)]
var played = false;
const chances = [[this.player,this.opponent],[this.opponent,this.player]][this.randomN(0,1)]
const emojis = [this.options?.emoji1 ?? "🔴", this.options?.emoji2 ?? "🟢"]
console.log(chances,emojis)
await this.edit({content:"",embeds:[Embed(genBoard(),'Aqua',this.options?.nextDes?.replace(/{emoji}/g,emojis[0])?.replace(/{next_player}/g,chances[0]) ?? `${emojis[0]} ${chances[0]} goes first`)], components:Rows},msg)
const collector = msg.createMessageComponentCollector({filter:(i) => i.user.id == chances[0].id || i.user.id == chances[1].id,idle:this.time,ComponentType:ComponentType.Button})
collector.on('collect', async i => {
   await i.deferUpdate();
   if(i.user.id !== chances[0].id) return;
   chances.reverse();
   emojis.reverse();
   const column = parseInt(i.customId[3]) - 1;
   const block = { x: -1, y: -1 };
   for (let y = 6 - 1; y >= 0; y--) {
     const currEmoji = game.board[column + (y * 7)];
     if (currEmoji == (this.options?.emptyEmoji ?? "⬛")) {
       game.board[column + (y * 7)] = emojis[1];
       block.x = column;
       block.y = y;
       break;
     }
   }
   if (block.y === 0) {
      Rows[column > 2 ? 1 : 0].components.find(c => c.data.custom_id == `c4_${column+1}`).setDisabled(true)
   }
   
   const gameStatus = verifyGame(block.x,block.y,emojis[1]);
   if (gameStatus == true) {
    played = true;
    collector.stop()
    await this.edit({embeds:[Embed(genBoard(),'Green',this.options?.winDes?.replace(/{winner}/g,chances[1])?.replace(/{loser}/g,chances[0])?.replace(/{winner_emoji}/g,emojis[1])?.replace(/{loser_emoji}/g,emojis[0]) ?? `${emojis[1]} ${chances[1]} won the game`)],components:Rows},msg);
    if(this.onWin) await this.onWin(chances[1],chances[0])
   }
   if (gameStatus == 'tie') {
    played = true;
    collector.stop()
    await this.edit({embeds:[Embed(genBoard(),'Red',this.options?.tieDes ?? 'Game Tied')],components:Rows},msg);
    if(this.onTie) await this.onTie(chances[0],chances[1])
   }
   if (gameStatus == false) {
    await this.edit({embeds:[Embed (genBoard(),'Aqua',this.options?.nextDes?.replace(/{emoji}/g,emojis[0])?.replace(/{next_player}/g,chances[0]) ?? `${emojis[0]} ${chances[0]}'s turn`)],components:Rows},msg)
   }
})
collector.on('end', async () => {
  if(played == false) {
    await this.edit({embeds:[Embed(genBoard(),'Red',this.options?.timeUpDes?.replace(/{timed_player}/g,chances[0])?.replace(/{emoji}/g,emojis[0]) ?? `Game Ended: ${emojis[0]} ${chances[0]} didn't respond on time`)],components:Rows},msg);
    if(this.onTimeUp) await this.onTimeUp(chances[0],chances[1]);
  }
})
}
else {
    await this.edit({content:"",embeds: [Embed(this.options?.declineDes ?? `${this.opponent} has declined your challenge`,'Red')], components:[]},msg)
  }
  }
  catch(e) {
    console.log(e)
   await this.edit({content:"", embeds: [Embed(this.options?.noResDes ?? `${this.opponent} did not respond in time`,'Red')], components:[]},msg)
  }
  }
  }

  module.exports = Connect4;