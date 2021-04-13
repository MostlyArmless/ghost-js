import * as React from 'react';
import { IPlayer } from '../interfaces';
import { TextboxAndButton } from './TextboxAndButton';

interface PromptUserForWordProps
{
    currentPlayer: IPlayer;
    previousPlayer: IPlayer;
    gameString: string;
    handleSubmitWord( word: string ): void;
}

interface PromptUserForWordState
{
}

const initialState: PromptUserForWordState = {
}

export class PromptUserForWord extends React.Component<PromptUserForWordProps, PromptUserForWordState>
{
    constructor( props: PromptUserForWordProps )
    {
        super( props );
        this.state = initialState;
    }

    handleSubmitWord = ( word: string ): void =>
    {
        if ( !word.startsWith( this.props.gameString ) )
        {
            alert( `Please submit a word that starts with "${this.props.gameString}"` );
            return;
        }

        this.props.handleSubmitWord( word );
    }

    render()
    {
        return (
            <>
                <h2>🐄💩</h2>
                <p>
                    { this.props.currentPlayer.name } has called bullshit on { this.props.previousPlayer.name }.
                <br />
                    { this.props.previousPlayer.name }, if you can enter a valid word that starts with "{ this.props.gameString }", then { this.props.currentPlayer.name } will be out of the game.
                </p>
                <TextboxAndButton
                    buttonText='Submit'
                    onSubmit={ this.handleSubmitWord }
                />
            </>
        );
    }
}