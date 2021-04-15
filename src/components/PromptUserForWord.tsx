import { IPlayer } from '../interfaces';
import { TextboxAndButton } from './TextboxAndButton';

interface PromptUserForWordProps
{
    currentPlayer: IPlayer;
    previousPlayer: IPlayer;
    gameString: string;
    handleSubmitWord( word: string ): void;
}

export function PromptUserForWord( props: PromptUserForWordProps )
{
    const handleSubmitWord = ( word: string ): void =>
    {
        if ( !word.startsWith( props.gameString ) )
        {
            alert( `Please submit a word that starts with "${props.gameString}"` );
            return;
        }

        props.handleSubmitWord( word );
    }

    return (
        <>
            <h2>🐄💩</h2>
            <p>
                { props.currentPlayer.name } has called bullshit on { props.previousPlayer.name }.
                <br />
                { props.previousPlayer.name }, if you can enter a valid word that starts with "{ props.gameString }", then { props.currentPlayer.name } will be out of the game.
                </p>
            <TextboxAndButton
                buttonText='Submit'
                onSubmit={ handleSubmitWord }
            />
        </>
    );
}