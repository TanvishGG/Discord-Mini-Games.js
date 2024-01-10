async function joke() {
   try {
    var data = await fetch(`https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,political,racist,sexist,explicit`)
    data = await data.json()
if(data.type == "single") {
  return data.joke;
}
if(data.type == "twopart") {
    return `${data.setup}\n ||${data.delivery}||`;
    } 
}
    catch(e) {
        throw new Error(e)
    }
}
module.exports = joke;