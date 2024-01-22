const wyr = require('./assets/wyr.json').wyr;
/**
 * Get a random Would You Rather question.
 * @returns {String} - Random Would You Rather question.
 */
function WouldYouRather() {
 return wyr[Math.floor(Math.random() * (wyr.length - 1))];
}
module.exports = WouldYouRather;