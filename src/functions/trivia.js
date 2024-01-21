const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
class Trivia{
  /**
   * Initialises a new instance of Trivia Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {Trivia} Game instance.
   */
    constructor(message,gameOptions) {
      if(!message) throw new Error("message is not provided");
      this.message = message;
      if(gameOptions && typeof gameOptions !== 'object') throw new TypeError("gameOptions must be an Object");
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
      this.options = gameOptions
      this.time = gameOptions?.time ?? 30000;
      this.replied = false;
      this.edit = async (messageOptions,replyMessage) => {
        messageOptions.fetchReply = true;
         if(this.replied == false) {
            this.replied=true; 
            if(this.isSlash == true) return await replyMessage.editReply(messageOptions)
            return await this.message.reply(messageOptions);}
            else return await replyMessage.edit(messageOptions)
          }
      this.difficulty = gameOptions?.difficulty ?? 'medium';
      if(this.difficulty !== 'easy' && this.difficulty !== 'medium' && this.difficulty !== 'hard') throw new RangeError('difficulty must be easy, medium or hard');
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      if(typeof this.isSlash !== 'boolean') throw new TypeError('isSlash must be a Boolean');
      if(this.onWin && typeof this.onWin !== 'function') throw new TypeError('onWin must be a Functon');
      if(this.onLose && typeof this.onLose !== 'function') throw new TypeError('onLose must be a Funtion');
      if(typeof this.time !== 'number') throw new TypeError('time must be a Number');
      if(this.time < 5000) throw new RangeError('time must be greater than 5000');
      if(this.options?.title && typeof this.options?.title !== 'string') throw new TypeError('title must be a String');
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
  const game = this;
async function fetchQuestion() {
    var res = 1;
while(res !== 0){
const data = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&difficulty=${game.difficulty}`)
const json = await data.json();
res = json.response_code;
if(res == 0) return json.results[0];
}
  }
const emojis = ["1️⃣","2️⃣","3️⃣","4️⃣"];
const question = await fetchQuestion();
const answer = decodeURIComponent(question.correct_answer);
question.incorrect_answers[3] = question.correct_answer;
const choices = shuffleArray(question.incorrect_answers);
  function oooEm(text,color) {
    const embed = new EmbedBuilder()
   .setTitle(game.options?.title ?? 'Trivia')
   .setDescription(`### ${decodeURIComponent(question.question)}

**Difficulty:** ${decodeURIComponent(question.difficulty)} | **Category:** ${decodeURIComponent(question.category)}
1️⃣ ${decodeURIComponent(choices[0])}
2️⃣ ${decodeURIComponent(choices[1])}
3️⃣ ${decodeURIComponent(choices[2])}
4️⃣ ${decodeURIComponent(choices[3])} ${text ? '\n\n' + text : ''}`)
   .setColor(color)
   .setThumbnail(game.player.avatarURL())
   .setTimestamp()
   .setFooter({text:`Requested by ${game.player.username}`})
   return embed;
  }
  function shuffleArray(lol) {
    let New = new Array().concat(lol)
    for (let i = New.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [New[i], New[j]] = [New[j], New[i]];
    }
    return New;
  }
  var Row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('trivia_0').setStyle(ButtonStyle.Secondary).setLabel("1️⃣"),
    new ButtonBuilder().setCustomId('trivia_1').setStyle(ButtonStyle.Secondary).setLabel("2️⃣"),
    new ButtonBuilder().setCustomId('trivia_2').setStyle(ButtonStyle.Secondary).setLabel("3️⃣"),
    new ButtonBuilder().setCustomId('trivia_3').setStyle(ButtonStyle.Secondary).setLabel("4️⃣"))
  const msg = await this.edit({embeds:[oooEm(null,'Green')],components:[Row]},this.message)
  const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, idle:this.time})
  let played = false;
  collector.on('collect', async (i) => {
  await i.deferUpdate();
  if(i.user.id == this.player.id) {
   played = true;
   collector.stop()
   Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
   if(decodeURIComponent(choices[i.customId[7]]) == answer) {
    await this.edit({embeds:[oooEm(this.options?.winDes?.replace(/{answer}/g,`"${answer}"`)?.replace(/{user_option}/g,`"${answer}"`) ?? `You won!, it was "${answer}"`,`Yellow`)],components:[Row]},msg)
    if(this.onWin) await this.onWin();
   }
   else {
    await this.edit({embeds:[oooEm(this.options?.loseDes?.replace(/{answer}/g,`"${answer}"`)?.replace(/{user_option}/g,emojis[i.customId[7]]) ?? `You Lost!, it was "${answer}"`,`Red`)],components:[Row]},msg)
    if(this.onLose) await this.onLose();
   }
  }
  })
  collector.on('end', async () => {
    if(played == false) {
    Row.components.forEach(x => x.setDisabled(true))
    await this.edit({embeds:[oooEm(this.options?.timeUpDes?.replace(/{answer}/g,`"${answer}"`) ?? `Game Ended: Timed Out, it was ` + answer,'Red')],components:[Row]},msg);
    }
  })
}
}

module.exports = Trivia;