import { API } from "./API";
import { chooseRandomLetter, getRandomElementFromArray } from "./tools";

export class RoboPlayer
{
    API: API;

    constructor( API: API )
    {
        this.API = API;
    }

    chooseNextLetter = async ( gameString: string ) =>
    {
        // AI will choose the next letter based on the current string
        console.log( `Taking AI turn, with current string = "${gameString}"...` );
        let nextLetter = "";

        let possibleWordList: string[] = [];
        if ( gameString.length > 0 )
        {
            possibleWordList = await this.API.getPossibleWords( gameString );
        }

        if ( possibleWordList.length > 0 )
        {
            const targetWord = getRandomElementFromArray( possibleWordList ); // AI will choose a new target word every turn.
            nextLetter = targetWord[gameString.length];
            if ( nextLetter === undefined )
            {
                nextLetter = chooseRandomLetter();
                console.log( `AI failed to choose a valid letter when aiming for target word "${targetWord}". overriding with random letter '${nextLetter}'` );
            }
            else
            {
                console.log( `AI aiming for target word "${targetWord}". Submitting next letter '${nextLetter}'` );
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
}