# CoinFlip
Find the odd word from the given list of 5 words.

## Importing
```js
const {OddOneOut} = require('discord-mini-games.js');
```
## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 30000, // timeup duration in milliseconds, default: 30000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    title: 'Odd One Out', // Embed Title.
    startDes: null, // Embed Description when game starts.
    winDes: 'You Won!', // Embed Description when player wins the game.
    loseDes: 'You Lost', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **winDes**
  - **`{answer}`** -> Answer.
  - **`{user_option}`** -> option choosen by the Player.
  - both are same since, player won.
- **loseDes**
  - **`{answer}`** -> Answer.
  - **`{user_option}`** -> option choosen by the Player.
  - both are different
- **timeUpDes**
  - **`{answer}`** -> Answer

## Starting the Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer previous block";
const game = new OddOneOut(message,gameOptions); // Initialising the Game.
game.run() // Starting the Game.
```