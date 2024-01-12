
/**
 * Fetch a random Dare
 * @returns {Promise<Object>} - A promise that resolves to a random Dare
 */
async function dare() {
  try {
  var data = await fetch(`https://api.truthordarebot.xyz/v1/dare`,{
    headers: {
      'Content-Type':'applocation/json'
    }
  })
  return await data.json();
}
  catch(e) {
  throw new Error(e)
  }
}
module.exports = dare;