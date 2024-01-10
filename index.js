const rps = require('./functions/rps');
const gtn = require('./functions/gtn');
const rtc = require('./functions/rtc');
const cf = require('./functions/cf');
const fts = require('./functions/fts')
module.exports = {
    RockPaperScissors: rps,
    GuessTheNumber: gtn,
    RepeatTheColor: rtc,
    CoinFlip: cf,
    FindTheStone: fts,
}