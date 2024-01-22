# Type Runner
Type the given Sentence as fast as you can.

## Importing
```js
const {TypeRunner} = require('discord-mini-games.js');
```

## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 120000, // timeup duration in milliseconds, default: 120000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    onTimeUp: () => {console.log('timeup')}, // Functuon to execute when game times out.
    title: 'Type Runner', // Embed Title.
    startDes: null, // Embed Description when game starts
    winDes: null, // Embed Description when player wins the game.
    loseDes: null, // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **winDes** & **loseDes**
  - **`{time}`** -> Actual Word.

## Starting The Game
```js
let message = message || interaction; // message object or interaction object
let gameOptions = "refer previous block";
const game = new TypeRunner(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```
