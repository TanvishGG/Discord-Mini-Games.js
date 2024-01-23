const discord = require('discord.js');
const {EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,ComponentType} = require('discord.js')
const questions = require('./assets/maths.json');
class MathsMagic{
  /**
   * Initialises a new instance of Maths Magic Game.
   * @param {`Message/Interaction`} message The Message Object.
   * @param {`GameOptions-Object`} gameOptions The game Options Object.
   * @returns {MathsMagic} Game instance.
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
      this.time = gameOptions?.time ?? 300000;
      this.replied = false;
      this.edit = async (messageOptions,replyMessage) => {
        messageOptions.fetchReply = true;
         if(this.replied == false) {
            this.replied=true; 
            if(this.isSlash == true) return await replyMessage.editReply(messageOptions)
            return await this.message.reply(messageOptions);}
            else return await replyMessage.edit(messageOptions)
          }
      this.onWin = gameOptions?.onWin ?? null;
      this.onLose = gameOptions?.onLose ?? null;
      this.question = questions[Math.floor(Math.random() * (questions.length - 1))]
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
const question = this.question.question;
const answer = this.question.answer;
const choices = this.question.options;
  function oooEm(text,color) {
    const embed = new EmbedBuilder()
   .setTitle(game.options?.title ?? 'Maths Magic')
   .setDescription(`**${question}**\n
1️⃣ ${choices[0]}
2️⃣ ${choices[1]}
3️⃣ ${choices[2]}
4️⃣ ${choices[3]}
5️⃣ ${choices[4]} ${text ? '\n\n' + text : ''}`)
   .setColor(color)
   .setThumbnail(game.player.avatarURL())
   .setTimestamp()
   .setFooter({text:`Requested by ${game.player.username}`})
   return embed;
  }
  var Row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('mm_0').setStyle(ButtonStyle.Secondary).setLabel("1️⃣"),
    new ButtonBuilder().setCustomId('mm_1').setStyle(ButtonStyle.Secondary).setLabel("2️⃣"),
    new ButtonBuilder().setCustomId('mm_2').setStyle(ButtonStyle.Secondary).setLabel("3️⃣"),
    new ButtonBuilder().setCustomId('mm_3').setStyle(ButtonStyle.Secondary).setLabel("4️⃣"),
    new ButtonBuilder().setCustomId('mm_4').setStyle(ButtonStyle.Secondary).setLabel("5️⃣"))
  const msg = await this.edit({embeds:[oooEm(null,'Green')],components:[Row]},this.message)
  const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, idle:this.time})
  let played = false;
  collector.on('collect', async (i) => {
  await i.deferUpdate();
  if(i.user.id == this.player.id) {
   played = true;
   collector.stop()
   Row.components.find(x => x.data.custom_id == i.customId).setDisabled(true)
   if(i.customId[3] == answer) {
    await this.edit({embeds:[oooEm(this.options?.winDes?.replace(/{answer}/g,`"${choices[answer]}"`)?.replace(/{user_option}/g,`"${choices[answer]}"`) ?? `You won!, it was "${choices[answer]}"`,`Yellow`)],components:[Row]},msg)
    if(this.onWin) await this.onWin();
   }
   else {
    await this.edit({embeds:[oooEm(this.options?.loseDes?.replace(/{answer}/g,`"${choices[answer]}"`)?.replace(/{user_option}/g,choices[i.customId[3]]) ?? `You Lost!, it was "${choices[answer]}"`,`Red`)],components:[Row]},msg)
    if(this.onLose) await this.onLose();
   }
  }
  })
  collector.on('end', async () => {
    if(played == false) {
    Row.components.forEach(x => x.setDisabled(true))
    await this.edit({embeds:[oooEm(this.options?.timeUpDes?.replace(/{answer}/g,`"${choices[answer]}"`) ?? `Game Ended: Timed Out, it was ` + choices[answer],'Red')],components:[Row]},msg);
    }
  })
}
}

module.exports = MathsMagic;