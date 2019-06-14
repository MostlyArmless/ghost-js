# Ghost - A Word Game

## Main Rules
This is a 2+ player word game. The game starts with the first player picking a letter. Taking turns, each player adds a letter to the current string. The first player to spell a real word becomes the Wordsmith, and is immediately killed. However, if you add a letter such that the string no longer _can become_ a word, you lose, but _only_ if the next player catches your bluff.

On your turn, you can either add a letter to the end of the current string, or if you suspect the player before you couldn't think of a word and was just bluffing, you can challenge the last player's move. If you challenge the previous player, they must provide an example word that could be constructed from the current string (including the letter they just added). If they can't come up with an example, then they're out of the game. But if they _can_, you must be punished for your lack of faith: you're out of the game.

May the best man never spell anything!

## Future features:
1. Bidirectional Ghost: Players can either also add a letter to the _beginning_ of the string

2. House Rules - Challenge & Add Letter VS Challenge Only: Allow users to choose whether a player must also add a letter if their challenge is successful, or if they're allowed to pass

3. Custom Dictionaries: Allow the user to define custom words they want to be considered valid.

4. House Rules - Auto-Kill Bluffers: Let user decide if they want the game to automatically kill players for submitting invalid strings

5. House Rules - Auto-Kill Wordsmith: Let user decide if they want the game to automatically kill players who complete a word, or if they want the next player to be responsible for challenging the Wordsmith

6. House Rules - Character Limits: Allow user to define the minimum number of characters for a string to be considered a word (e.g. set to 4 so that player "ax" + "e" doesn't make you a Wordsmith)

7. House Rules - Play continues after Wordsmith dies: Allow user to decide whether becoming a Wordsmith immediately ends the game, or whether the remaining players are allowed to continue using the string
	NOTE: need to make a new temp dictionary by pruning the current string from the real dictionary

8. Difficulty Modes: Implement multiple difficulty levels for AI players by defining different dictionary files containing simple VS rare words that they can draw from when playing, and making it so that the AI won't just randomly select a letter, but will always work towards building a possible word without actually completing it.

#Developer Notes:
Maybe I should add a PossibleWords property to GhostGame that contains a list of all possible words that could be constructed from the current string, and which updates every turn. This would be a good debugging tool, regardless. When there's lots of matches, it should display a sample 9 words: the 3 shortest words, 3 longest words, and 3 words from the middle of the list. Need to sort the list of candidate words by length and grab the first 3, last 3, and 3 from the middle with an even/odd length if statement.