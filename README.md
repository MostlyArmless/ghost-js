# Ghost - A Word Game

## Overview

Ghost is a 2+ player word game, originally devised as a game for hiking buddies to play spoken aloud while walking. Players take turns adding letters to a string, the first person to spell a real word loses, and you can play against an AI.

### Rules of the Game
1. Players take turns adding 1 letter at a time to a string.
2. First player to spell a real word loses.
3. You must always be working towards _some_ real word. If you add a letter that makes it impossible to spell a word, the next player can challenge you. If you can come up with a real word that could be spelled using your letters, the challenger loses, otherwise you lose.

## Features
* Choose the minimum number of letters the string must contain before it counts as a real word and can get you killed. Default is 4 letters.
* You can add custom words to the game dictionary
* You can blacklist words from the dictionary so they won't be automatically recognized as words by the AI players
* Different game modes: you can choose to allow letters to be added to the end of the string, the beginning, or both!
* In human-vs-human games, you can choose to enable auto-bluff detection, so the game will call you on your bluffs automatically
* For fun, you can display a list of possible words that can be spelled given the current game string
* 2 different AI difficulties:
  * In Easy mode, the AI doesn't make any plans, it just identifies a random word that it could work towards and adds the next letter. It chooses a different target word each turn.
  * In Hard mode, the AI will always work towards the same target word, until it is no longer spellable with the current string. It will always try to choose a target word which will prevent it from losing (based on the word's length and the number of players in the game)

## Future features

1. Multi-AI play. Currently, the game only supports a single AI player.
2. House Rules - Challenge & Add Letter VS Challenge Only: Allow users to choose whether a player must also add a letter if their challenge is successful, or if they're allowed to pass
3. House Rules - Play continues after Wordsmith dies: Allow user to decide whether becoming a Wordsmith immediately ends the game, or whether the remaining players are allowed to continue using the string

> NOTE: need to make a new temp dictionary by pruning the current string from the real dictionary



## Developer Notes

To run this in development mode, just `npm run dev` and then run the VS Code debugger with `F5`. Make sure you `npm start` the [`ghost-word-server`](https://github.com/MostlyArmless/ghost-word-server) first though.

Maybe I should add a PossibleWords property to GhostGame that contains a list of all possible words that could be constructed from the current string, and which updates every turn. This would be a good debugging tool, regardless. When there's lots of matches, it should display a sample 9 words: the 3 shortest words, 3 longest words, and 3 words from the middle of the list. Need to sort the list of candidate words by length and grab the first 3, last 3, and 3 from the middle with an even/odd length if statement.

### Running Mocha Tests
The Mocha tests are invoked with the Mocha Test Explorer VS Code extension. React wants the tsconfig option `compilerOptions.module` to be set to `esnext`, which it will do every time you run `npm run dev`. However, if you want to run the mocha tests, you must set that option to `commonjs`. You can do this automatically by running `npm run mocha-setup` which will modify the `tsconfig.json` file directly, then you can use the Mocha Test Explorer extension to run the tests. Note that you should stop the debugger and kill the React dev server before doing this.