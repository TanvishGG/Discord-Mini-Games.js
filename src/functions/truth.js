
/**
 * Fetch a random Truth
 * @returns {Promise<Object>} - A promise that resolves to a random Truth
 */
async function truth() {
  try {
  var data = await fetch(`https://api.truthordarebot.xyz/v1/truth`,{
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
module.exports = truth;