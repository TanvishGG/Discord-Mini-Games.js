# Guess The Number
Guess the number I'm thinking of between 1-20 in 3 tries.

## Importing
```js
const {GuessTheNumber} = require('discord-mini-games.js');
```
## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 45000, // timeup duration in milliseconds, default: 45000.
    tries: 3, // Number of Tries, default: 3.
    max: 20, // Max range of the number, default: 20.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    onTimeUp: () => {console.log('timeup')}, // Function to execute if game times out.
    title: 'Guess The Number', // Embed Title.
    startDes: 'Guess the number I\'m Thinking of between 1-20 in 3 tries', // Embed Description when game starts.
    retryDes: 'You Guessed {user_option}, but it\'s wrong. You have {tries} tries left! ' // Rety Message
    winDes: 'You Won!, it was {number}', // Embed Description when player wins the game.
    loseDes: 'You Lost, it was {number}', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **retryDes**
  - **`{user_option}`** -> User's Guess.
  - **`{tries}`** -> Tries left.
  - **`{status}`** -> Wether user's guess is lower/higher than the actual number.
- **winDes**
  - **`{user_option}`** -> User's Guess.
  - **`{number}`** -> Actual Number.
  - both are same.
- **loseDes**
  - **`{user_option}`** -> User's Guess.
  - **`{number}`** -> Actual Number.
  - both are different.

## Starting The Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer previous block";
const game = new GuessTheNumber(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```