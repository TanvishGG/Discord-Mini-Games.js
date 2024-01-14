
/**
 * Fetch a random Dare
 * @returns {Promise<String>} - A promise that resolves to a random Dare
 */
async function dare() {
  try {
  var data = await fetch(`https://api.truthordarebot.xyz/v1/dare`,{
    headers: {
      'Content-Type':'applocation/json'
    }
  })
  data = await data.json()
  return data.question;
}
  catch(e) {
  throw new Error(e)
  }
}
module.exports = dare;