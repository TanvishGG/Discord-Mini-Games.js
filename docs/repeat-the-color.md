# Repeat The Color
Watch and remember the color sequence given by the bot, and repeat the sequence correctly.

## Importing 
```js
const {RepeatTheColor} = require('discord-mini-games.js');
```

## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 30000, // timeup duration in milliseconds, default: 30000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    onTimeUp: () => {console.log('timeup')}, // Function to execute if game times out.
    title: 'Repeat The Color', // Embed Title.
    startDes: 'Remember the following color sequence', // Embed Description when game starts and while displaying the sequence.
    startDes2: 'Now repeat the sequence', // after the color sequence disappears.
    winDes: 'You Won!', // Embed Description when player wins the game.
    loseDes: 'You Lost', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting 
This Game doesn't support any formatting.
## Starting the Game
```js
const message = message || interaction; // message Object or interaction object.
const gameOptions = 'refer previous block'
const game = new RepeatTheColor(message,gameOptions); // Initialising the Game.
game.run() // Starting the Game.
```