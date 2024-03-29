# Tic Tac Toe
Play Tic Tac Toe

## Importing
```js
const {TicTacToe} = require('discord-mini-games.js');
```

## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 30000, // timeup duration in milliseconds, default: 30000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onTie: () => {console.log('lose')}, // Function to execute when game ties.
    onTimeUp: () => {console.log('timeup')}, // Function to execute when game times out.
    title: 'Tic Tac Toe', // Embed Title.
    opEmoji: "🟢", // Opponent Box Emoji.
    playerEmoji: "❌", // Player Box Emoji.
    emptyEmoji: "◼️", // Empty Box Emoji.
    footer: null, // Embed Footer.
    winDes: null, // Embed Description when player wins the game.
    nextDes: null, // Embed Description for next move
    tieDes: null, // Embed Description when game ties.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.
    resTime: 30000, // wait time for opponent response, default: 30000.
    opponent: User, // User object of the opponent.
    confirmDes: null, // Embed Description of Confirmation Embed.
    declineDes: 'User Declined the Game', // Embed Description when user declines the game challenge.
    noResDes: 'User didn\'t respond', // Embed Description when user didn't respond.
}
```
## Formatting
The Texts for embed description accepts following formatting:
- **nextDes**
  - **`{next_player}`** -> Next Player.
  - **`{emoji}`** -> Next Player's Emoji.
- **winDes**
  - **`{winner}`** -> Game Winner.
  - **`{emoji}`** -> Winner's Emoji. 
- **timeUpDes**
  - **`{timed_player}`** -> Player who didn't respond in time.
  - **`{emoji}`** -> Emoji of that Player.

## Function Parameters
`onWin` function executes with 2 function parameters to allow winner/loser based actions
```js
function onWin(winner,loser) {
    // Both are User Objects
    console.log(winner.username, "won the game against", loser.username);
}
```
`onTimeUp` function executes with 2 function parameters
```js
function onTimeUp(timed_player,other) {
  // Both are User Objects
  console.log(timed_user, "didn't respond in time");
}
```

## Starting The Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer GameOptions block";
const game = new TicTacToe(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```