const rps = require('./functions/rps');
const gtn = require('./functions/gtn');
const ttt = require('./functions/ttt');
const rtc = require('./functions/rtc');
const cf = require('./functions/cf');
const ooo = require('./functions/ooo');
const trivia = require('./functions/trivia')
const fts = require('./functions/fts');
const wordle = require('./functions/wordle');
const dare = require('./functions/dare');
const truth = require('./functions/truth');
const joke = require('./functions/joke');
const EightBall = require('./functions/8ball')
module.exports = {
    RockPaperScissors: rps,
    GuessTheNumber: gtn,
    TicTacToe: ttt,
    RepeatTheColor: rtc,
    CoinFlip: cf,
    OddOneOut: ooo,
    Trivia: trivia,
    FindTheStone: fts,
    Wordle:wordle,
    Dare: dare,
    Truth: truth,
    Joke:joke,
    EightBall:EightBall
}