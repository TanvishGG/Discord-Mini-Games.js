# Wordle 
Guess the 5 Letter Word, the Bot is thinking of by guessing other 5 Letter Words in 5 chances.

## Game Rules
- -> Guess the 5 Letter Word Bot is thinking of.
- -> You have 5 Chances
- -> Keep guessing words for hints.
- -> 🟥 Red Square means that letter doesn't exist in the word.
- -> 🟨 Yellow Square means that letter exists in the word but in different position.
- -> 🟩 Green Square means that letter exists in the word in that exact position.

## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 180000, // timeup duration in milliseconds, default: 180000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onLose: () => {console.log('lose')}, // Function to execute if player loses the game.
    title: 'CoinFlip', // Embed Title.
    startDes: 'Guess the 5 Letter word I\'m thinking of', // Embed Description when game starts
    winDes: 'You Won!', // Embed Description when player wins the game.
    loseDes: 'You Lost', // Embed Description when player loses the game.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
}
```
## Formatting
The texts for embed descriptions accepts following formatting.
- **winDes** & **loseDes**
  - **`{word}`** -> Actual Word.

## Starting The Game
```js
let message = message || interaction; // message object or interaction object
let gameOptions = "refer previous block";
const game = new Wordle(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```