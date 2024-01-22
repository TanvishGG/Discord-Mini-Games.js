const dares = require('./assets/dare.json').dare;
/**
 * Get a random Dare.
 * @returns {String} - Random Dare.
 */
function Dare() {
 return dares[Math.floor(Math.random() * (dares.length - 1))];
}
module.exports = Dare;