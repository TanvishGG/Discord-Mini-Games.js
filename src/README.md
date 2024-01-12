# Discord-Mini-Games.js
a package to implement mini-games using discord.js v14

## Available Games
1. RockPaperScissors -> Single Player and Multi-Player
2. GuessTheNumber -> Single Player
3. RepeatTheColor -> Single Player
4. FindTheStone -> Single Player
5. CoinFlip -> Single Player
6. Wordle -> Single Player
7. Joke
8. Truth 
9. Dare
10. EightBall
## Game Options
```js
{
 opponent: Object, // User Object
 time: +Integer, // Wait Duration in milliseconds
 isSlash: Boolean, // Whether this is a slash command
}
```
## Example
```js
const {RockPaperScissors} = require('discord-mini-games.js');
const gameOptions = {
    isSlash:false,
    time:30000,
    opponent: message.mentions.users.first()
}
const game = new RockPaperScissors(message,gameOptions)
game.run();
```

### Made with ❤️ by [TanvishGG](https://github.com/TanvishGG)