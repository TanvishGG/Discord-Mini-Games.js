const truths = require('./assets/truth.json').truth;
/**
 * Get a random Truth.
 * @returns {String} - Random Truth.
 */
function Truth() {
 return truths[Math.floor(Math.random() * (truths.length - 1))];
}
module.exports = Truth;