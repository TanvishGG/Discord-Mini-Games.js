# CoinFlip
A Game, where the Bot flips a Coin and you have to guess whether it's Heads or Tails.

## Importing
```js
const {CoinFlip} = require('discord-mini-games.js');
```
## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 30000, // timeup duration in milliseconds, default: 30000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    title: 'CoinFlip', // Embed Title.
    startDes: 'Choose Heads or Tails', // Embed Description when game starts.
    winDes: 'You Won!', // Embed Description when player wins the game.
    loseDes: 'You Lost', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **winDes**
  - **`{bot_option}`** -> Heads/Tails option choosen by the Bot.
  - **`{user_option}`** -> Heads/Tails option choosen by the Player.
  - both are same since, player won.
- **loseDes**
  - **`{bot_option}`** -> Heads/Tails option choosen by the Bot.
  - **`{user_option}`** -> Heads/Tails option choosen by the Player.
  - both are different
- **timeUpDes**
  - **`{bot_option}`** -> Heads/Tails option choosen by the Bot.
## Starting the Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer previous block";
const game = new CoinFlip(message,gameOptions); // Initialising the Game.
game.run() // Starting the Game.
```