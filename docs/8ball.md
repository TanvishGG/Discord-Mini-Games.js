---
title: EightBall
subtitle: A Game, where you can ask the bot a yes/no question.

--- 

## Importing

```js
const {EightBall} = require('discord-mini-games.js');
```

## Starting The Game

```js
let message = message || interaction; // Message Object Or Interaction Object
let question = "Am I Dumb?"; // A yes/no question.
await EightBall(message,question);
```
returns messageObject of the Game.