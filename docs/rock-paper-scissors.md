# Rock Paper Scissors
Play Rock Paper Scissors.
- Single Player against the Bot.
- Multiplayer against a player.

## Importing
```js
const {RockPaperScissors} = require('discord-mini-games.js');
```

## GameOptions
```js
const gameOptions = {
    isSlash: false, // wether the game is a slash command, default: false.
    time: 30000, // timeup duration in milliseconds, default: 30000.
    onWin: () => {console.log("win")}, // Function to execute if player wins the game.
    onTie: () => {console.log('lose')}, // Function to execute when game ties.
    onTimeUp: () => {console.log('timeup')}, // Function to execute when game times out.
    title: 'Rock Paper Scissors', // Embed Title.
    startDes: 'Choose your option', // Embed Description when game starts.
    winDes: null, // Embed Description when player wins the game.
    tieDes: null, // Embed Description when game ties.
    timeUpDes: 'Game Over: Timed Out', // Embed Description when game times out.

// <- Single-Player Options ->

    onLose: () => {console.log('lose')}, // function to execute when player loses the game.
    loseDes: null, // Embed Description when Player loses

// <- Multi-Player Options ->

    resTime: 30000, // wait time for opponent response, default: 30000.
    opponent: User, // User object of the opponent.
    confirmDes: 'Do you want to play a Rock Paper Scissors match?', // Embed Description of Confirmation Embed.
    declineDes: 'User Declined the Game', // Embed Description when user declines the game challenge.
    noResDes: 'User didn\'t respond', // Embed Description when user didn't respond.
}
```
## Formatting
The Texts for embed description accepts following formatting.
- ### Single Player
- **winDes**
  - **`{bot_option}`** -> option choosen by the Bot.
  - **`{user_option}`** -> option choosen by the Player.
- **loseDes**
  - **`{bot_option}`** -> option choosen by the Bot.
  - **`{user_option}`** -> option choosen by the Player.
- **tieDes**
  - **`{bot_option}`** -> option choosen by the Bot.
  - **`{user_option}`** -> option choosen by the Player.
  - both are same.
- ### Multi Player
- **winDes**
  - **`{winner}`** -> Game Winner.
  - **`{winner_choice}`** -> Winner's Choice.
  - **`{loser}`** -> Game Loser.
  - **`{loser_choice}`** -> Loser's Choice.
- **tieDes**
  - **`{option}`** -> Common Choice of both players.
- **timeUpDes**
  - **`{timed_player}`** -> Player who took too long to respond.

## Function Parameters
`onWin` function of multiplayer executes with 2 function parameters to allow winner/loser based actions
```js
function onWin(winner,loser) {
    // Both are User Objects
    console.log(winner.username, "won the game against", loser.username) 
}
```
`onTimeUp` function of multiplayer executes with 2 function parameters 
```js
function onTimeUp(timed_player,other) {
  // Both are User Objects
  console.log(timed_player,"didn't respond in time")
}
```

## Starting The Game
```js
let message = message || interaction; // message object or interaction object.
let gameOptions = "refer GameOptions block";
const game = new RockPaperScissors(message,gameOptions); // Initialising the Game.
game.run(); // Starting the Game.
```