const paranoias = require('./assets/paranoia.json').paranoia;
/**
 * Get a random Paranoia question.
 * @returns {String} - Random Paranoia question.
 */
function Paranoia() {
 return paranoias[Math.floor(Math.random() * (paranoias.length - 1))];
}
module.exports = Paranoia;