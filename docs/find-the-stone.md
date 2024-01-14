# Find The Stone.
A Game, where player has to find the Cup under which there is a Stone.

## Importing
```js
const {FindTheStone} = require('discord-mini-games.js');
```
## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 45000, // timeup duration in milliseconds, default: 45000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    title: 'Find The Stone', // Embed Title.
    startDes: 'Find The Cup which has a stone under it.', // Embed Description when game starts.
    winDes: 'You Won!', // Embed Description when player wins the game.
    loseDes: 'You Lost', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **winDes**
  - **`{bot_option}`** -> option choosen by the Bot.
  - **`{user_option}`** -> option choosen by the Player.
  - both are same since, player won.
- **loseDes**
  - **`{bot_option}`** -> option choosen by the Bot.
  - **`{user_option}`** -> option choosen by the Player.
  - both are different.

## Starting the Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer previous block";
const game = new FindTheStone(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```