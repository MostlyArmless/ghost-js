import { IAPI } from "./API";
import { eGameActions } from "./constants";
import { AppendOrPrependMode, DifficultyLevel, ILetterChoosingStrategy } from "./interfaces";
import { chooseRandomLetter, convertEnumValToString, getRandomElementFromArray } from "./tools";

export class RoboPlayer
{
    private API: IAPI;
    private difficulty: DifficultyLevel;
    private targetWord: string;
    private numPlayersInGame: number;

    constructor( API: IAPI, difficulty: DifficultyLevel, numPlayersInGame: number )
    {
        this.API = API;
        this.difficulty = difficulty;
        this.targetWord = "";
        this.numPlayersInGame = numPlayersInGame;
    }

    setTargetWordForUnitTestPurposes( targetWord: string ): void
    {
        this.targetWord = targetWord;
    }

    reset(): void
    {
        this.targetWord = "";
    }

    setDifficultyLevel( difficulty: DifficultyLevel ): void
    {
        this.difficulty = difficulty;
    }

    setNumPlayers( numPlayersInGame: number ): void
    {
        this.numPlayersInGame = numPlayersInGame;
    }

    private shouldCallBullshit = async ( gameString: string, appendOrPrependMode: AppendOrPrependMode ): Promise<boolean> =>
    {
        // TODO make these calls more efficient by implementing a "count" API for each of them
        let possibleWords: string[] = [];
        switch ( appendOrPrependMode )
        {
            case "Append Only":
                possibleWords = await this.API.getAllWordsStartingWith( gameString );
                break;
            case "Prepend Only":
                possibleWords = await this.API.getAllWordsEndingWith( gameString );
                break;
            case "Append or Prepend":
                possibleWords = await this.API.getAllWordsContaining( gameString );
                break;
            default:
                return false;
        }
        console.log( possibleWords.length );
        return possibleWords.length === 0;
    }

    decideNextMove = async ( gameString: string, appendOrPrependMode: AppendOrPrependMode ): Promise<eGameActions> =>
    {
        if ( await this.shouldCallBullshit( gameString, appendOrPrependMode ) )
        {
            console.log( `robot wants to call BS on gameString "${gameString}"` );
            return eGameActions.CallBullshit;
        }

        let action: eGameActions;
        switch ( appendOrPrependMode )
        {
            case "Append Only":
                action = eGameActions.AppendLetter;
                break;
            case "Prepend Only":
                action = eGameActions.PrependLetter;
                break;
            case "Append or Prepend":
                action = eGameActions.AppendLetter; // TODO implement this
                break;
            default:
                action = eGameActions.CallBullshit; // Shouldn't ever end up here
                break;
        }
        console.log( `Robot chose action ${convertEnumValToString( eGameActions, action )}` );
        return action;
    }

    // Must pass a non-zero-length possibleWordList
    private getWordThatWillLetRobotWinAppendOnlyMode( gameString: string, possibleWordList: string[] ): string
    {
        const numAdditionalWordLengthsToConsider = 5;
        const wordLengthsThatWillMakeMeLose: number[] = new Array( numAdditionalWordLengthsToConsider )
            .fill( 1 )
            .map( ( e, i ) => e + i * this.numPlayersInGame + gameString.length );

        const wordsThatWontMakeMeLose = possibleWordList.filter( word => !wordLengthsThatWillMakeMeLose.includes( word.length ) );
        if ( wordsThatWontMakeMeLose.length > 0 )
            return getRandomElementFromArray( wordsThatWontMakeMeLose );

        // If we couldn't find any winning words in the list, just randomly pick one of the ones that will make us lose and hope the other player(s) make a mistake
        const randomWord = getRandomElementFromArray( possibleWordList ) as string;
        console.log( `AI attempted to choose a winning word, but couldn't find one, so randomly choosing a random word: "${randomWord}"` );
        return randomWord;
    }

    private choseNextLetter = async ( gameString: string, choosingStrategy: ILetterChoosingStrategy ) =>
    {
        // AI will choose the next letter based on the current string
        console.log( `Choosing letter for ${this.difficulty} AI to append, with current string = "${gameString}"...` );
        if ( gameString.length === 0 )
            return chooseRandomLetter();

        // Use the provided choosing strategy to identify the possible words we could strive for
        const possibleWordList = await choosingStrategy.getPossibleWords( gameString );
        console.log( `AI identified ${possibleWordList.length} possible words for "${gameString}"` );

        // If there are no possible remaining words, just randomly guess a letter and hope the next player fails to call our bluff
        if ( possibleWordList.length === 0 )
            return chooseRandomLetter();

        // If we haven't chosen a target word yet, choose it now.
        if ( this.targetWord?.length === 0 )
            this.targetWord = getRandomElementFromArray( possibleWordList );

        if ( !possibleWordList.includes( this.targetWord ) )
        {
            console.log( `AI's previous target word "${this.targetWord}" no longer valid, choosing new target word...` );
            if ( this.difficulty === "Easy" )
            {
                this.targetWord = getRandomElementFromArray( possibleWordList );
            }
            else if ( this.difficulty === "Hard" )
            {
                this.targetWord = this.getWordThatWillLetRobotWinAppendOnlyMode( gameString, possibleWordList );
            }
        }

        console.log( `AI target word = "${this.targetWord}"` );
        return choosingStrategy.chooseNextLetter( this.targetWord, gameString ) ?? chooseRandomLetter();
    }

    chooseLetterToAppend = async ( gameString: string ) =>
    {
        return await this.choseNextLetter( gameString,
            {
                getPossibleWords: this.API.getAllWordsStartingWith,
                chooseNextLetter: ( targetWord: string, gameString: string ) => targetWord[gameString.length]
            } );
    };

    chooseLetterToPrepend = async ( gameString: string ) =>
    {
        return await this.choseNextLetter( gameString,
            {
                getPossibleWords: this.API.getAllWordsEndingWith,
                chooseNextLetter: ( targetWord: string, gameString: string ) => targetWord[targetWord.length - gameString.length - 1]
            } );
    };
}