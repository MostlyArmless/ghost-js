import { API } from "./API";
import { eGameActions } from "./constants";
import { DifficultyLevel } from "./interfaces";
import { chooseRandomLetter, getRandomElementFromArray } from "./tools";

export class RoboPlayer
{
    private API: API;
    private difficulty: DifficultyLevel;
    private targetWord: string;
    private numPlayersInGame: number;

    constructor( API: API, difficulty: DifficultyLevel, numPlayersInGame: number )
    {
        this.API = API;
        this.difficulty = difficulty;
        this.targetWord = "";
        this.numPlayersInGame = numPlayersInGame;
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

    private shouldCallBullshit = async ( gameString: string ): Promise<boolean> =>
    {
        const numPossibleWords = await this.API.countPossibleWords( gameString );
        return numPossibleWords === 0;
    }

    decideNextMove = async ( gameString: string ): Promise<eGameActions> =>
    {
        if ( await this.shouldCallBullshit( gameString ) )
            return eGameActions.CallBullshit;
        else
            return eGameActions.AppendLetter;
        // TODO - implement prependLetter logic
    }

    private getWordThatWillLetRobotWinAppendOnlyMode( gameString: string, possibleWordList: string[] ): string
    {
        const numAdditionalWordLengthsToConsider = 5;
        const wordLengthsThatWillMakeMeLose: number[] = new Array( numAdditionalWordLengthsToConsider )
            .fill( 1 )
            .map( ( e, i ) => e + i * this.numPlayersInGame + gameString.length );

        for ( let i = 0; i < possibleWordList.length; i++ )
        {
            const word = possibleWordList[i];
            if ( wordLengthsThatWillMakeMeLose.includes( word.length ) )
                continue;

            // Choose the first viable word that we find
            return possibleWordList[i];
        }
        // If we couldn't find any winning words in the list, just randomly pick one of the ones that will make us lose and hope the other player(s) make a mistake
        return getRandomElementFromArray( possibleWordList ) as string;
    }

    chooseLetterToAppend = async ( gameString: string ) =>
    {
        // AI will choose the next letter based on the current string
        console.log( `Choosing letter for ${this.difficulty} AI to append, with current string = "${gameString}"...` );
        if ( gameString.length === 0 )
            return chooseRandomLetter();

        let nextLetter = "";

        const possibleWordList = await this.API.getAllWordsEndingWith( gameString );

        // If we haven't chosen a target word yet, choose it now.
        if ( this.targetWord?.length === 0 )
            this.targetWord = getRandomElementFromArray( possibleWordList );

        if ( possibleWordList.length > 0 )
        {
            if ( !possibleWordList.includes( this.targetWord ) )
            {
                // Our previous target word is no longer valid, we need a new target word
                if ( this.difficulty === "Easy" )
                    this.targetWord = getRandomElementFromArray( possibleWordList );
                else if ( this.difficulty === "Hard" )
                    this.targetWord = this.getWordThatWillLetRobotWinAppendOnlyMode( gameString, possibleWordList );

            }

            nextLetter = this.targetWord[gameString.length];
            if ( nextLetter === undefined )
            {
                nextLetter = chooseRandomLetter();
                console.log( `AI failed to choose a valid letter when aiming for target word "${this.targetWord}". overriding with random letter '${nextLetter}'` );
            }
            else
            {
                console.log( `AI aiming for target word "${this.targetWord}". Submitting next letter '${nextLetter}'` );
            }
        }
        else
        {
            // AI realizes it can't do anything so it'll try to BS with a random letter
            nextLetter = chooseRandomLetter();
            console.log( `AI can't think of any words, bullshitting with letter '${nextLetter}'` );
        }

        return nextLetter;
    };

    chooseLetterToPrepend = async ( gameString: string ) =>
    {
        // AI will choose the next letter based on the current string
        console.log( `Choosing letter for ${this.difficulty} AI to prepend, with current string = "${gameString}"...` );
        if ( gameString.length === 0 )
            return chooseRandomLetter();

        let nextLetter = "";

        const possibleWordList = await this.API.getAllWordsStartingWith( gameString );

        // If we haven't chosen a target word yet, choose it now.
        if ( this.targetWord?.length === 0 )
            this.targetWord = getRandomElementFromArray( possibleWordList );

        if ( possibleWordList.length > 0 )
        {
            if ( !possibleWordList.includes( this.targetWord ) )
            {
                // Our previous target word is no longer valid, we need a new target word
                if ( this.difficulty === "Easy" )
                    this.targetWord = getRandomElementFromArray( possibleWordList );
                else if ( this.difficulty === "Hard" )
                    this.targetWord = this.getWordThatWillLetRobotWinAppendOnlyMode( gameString, possibleWordList );

            }

            nextLetter = this.targetWord[gameString.length];
            if ( nextLetter === undefined )
            {
                nextLetter = chooseRandomLetter();
                console.log( `AI failed to choose a valid letter when aiming for target word "${this.targetWord}". overriding with random letter '${nextLetter}'` );
            }
            else
            {
                console.log( `AI aiming for target word "${this.targetWord}". Submitting next letter '${nextLetter}'` );
            }
        }
        else
        {
            nextLetter = chooseRandomLetter();
            console.log( `AI can't think of any words, bullshitting with letter '${nextLetter}'` );
        }

        return nextLetter;
    };
}