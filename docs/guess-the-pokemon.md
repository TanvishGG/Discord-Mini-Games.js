# Guess The Pokemon
Guess the Name of the Pokemon given in the Image.

## Importing
```js
const {GuessThePokemon} = require('discord-mini-games.js');
```
## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 45000, // timeup duration in milliseconds, default: 45000.
    tries: 2, // Number of Tries, default: 2.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    onTimeUp: () => {console.log('timeup')}, // Function to execute if game times out.
    title: 'Guess The Pokemon', // Embed Title.
    startDes: null, // Embed Description when game starts.
    retryDes: 'You Guessed {user_option}, but it\'s wrong. You have {tries} tries left! \n Hint: {hint} ' // Rety Message
    winDes: 'You Won!, it was {pokemon}', // Embed Description when player wins the game.
    loseDes: 'You Lost, it was {pokemon}', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **retryDes**
  - **`{user_option}`** -> User's Guess.
  - **`{tries}`** -> Tries left.
  - **`{hint}`** -> Masked Answer as a Hint.
- **winDes**
  - **`{user_option}`** -> User's Guess.
  - **`{pokemon}`** -> Pokemon.
  - both are same.
- **loseDes**
  - **`{user_option}`** -> User's Guess.
  - **`{pokemon}`** -> Pokemon.
  - both are different.
- **timeUpDes**
  - **`{pokemon}`** -> Pokemon.

## Starting The Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer previous block";
const game = new GuessThePokemon(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```