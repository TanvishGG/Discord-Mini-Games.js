# Trivia
Gives you a multiple choice trivia

## Importing
```js
const {Trivia} = require('discord-mini-games.js');
```
## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 30000, // timeup duration in milliseconds, default: 30000.
    difficulty: 'medium', // question difficulty: easy, medium, hard, default: medium .
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    title: 'Trivia', // Embed Title.
    winDes: 'You Won!', // Embed Description when player wins the game.
    loseDes: 'You Lost', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **winDes**
  - **`{answer}`** -> Correct Answer.
  - **`{user_option}`** -> option choosen by the Player.
  - both are same since, player won.
- **loseDes**
  - **`{answer}`** -> Correct Answer.
  - **`{user_option}`** -> option choosen by the Player.
  - both are different
- **timeUpDes**
  - **`{answer}`** -> Correct Answer.
## Starting the Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer previous block";
const game = new Trivia(message,gameOptions); // Initialising the Game.
game.run() // Starting the Game.
```