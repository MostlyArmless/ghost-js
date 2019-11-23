import * as React from 'react';
import { Player } from '../interfaces';
import { Spinner } from './Spinner';
import { Button } from './Button'
import * as _ from 'underscore';
import { ENTER_KEY_CODE } from '../constants';

const initialState: PlayState = {
    gameString: '',
    nextChar: ''
}

export interface PlayState
{
    gameString: string;
    nextChar: string;
}

export interface PlayProps
{
    handleNextCharChange( event: any ): void;
    nextChar: string;
    gameString: string;
    getCurrentPlayer(): Player;
    getPreviousPlayer(): Player;
    commitNextChar(): void;
    possibleWordList: string[];
    handleCallBullshit(): void;
    aiPlaceLetterAndCommit(): void;
    handleExitGame(): void;
    displayWordList: boolean;
}

export class Play extends React.Component<PlayProps, PlayState> {
    constructor( props: PlayProps )
    {
        super( props );
        this.state = initialState;
    }

    onKeyDown = ( event: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( event.keyCode === ENTER_KEY_CODE )
        {
            this.props.commitNextChar();
        }
    }

    render()
    {
        const possibleWordListForDisplay = this.props.displayWordList && this.buildPossibleWordList();

        const bullshitButton = this.props.gameString.length > 0 &&
            <Button
                onClick={ this.props.handleCallBullshit }
                text={ `Call Bullshit on ${this.props.getPreviousPlayer().name}` }
            />;

        let spinner = this.props.getCurrentPlayer().type == 'AI' &&
            <Spinner
                loading={ this.props.getCurrentPlayer().type == 'AI' }
                onLoadFinished={ this.props.aiPlaceLetterAndCommit } />;

        return (
            <>
                <h1>Ghost</h1>
                <Button
                    id={ 1 }
                    onClick={ this.props.handleExitGame }
                    text='Quit Game'
                />
                <p>It is currently { this.props.getCurrentPlayer().name }'s turn</p>

                { spinner }

                <p>Enter the next character:</p>
                <input
                    autoComplete='off'
                    onChange={ this.props.handleNextCharChange }
                    type='text'
                    id='nextChar'
                    maxLength={ 1 }
                    onKeyDown={ this.onKeyDown }
                    value={ this.props.nextChar }
                />
                <p>Game String:</p>
                <input
                    autoComplete='off'
                    value={ this.props.gameString }
                    type='text'
                    id='gameString'
                    readOnly={ true }
                />
                { bullshitButton }
                { possibleWordListForDisplay }
            </>
        );
    }

    private buildPossibleWordList()
    {
        const randomSubsetOfPossibleWords: string[] = _.sample( this.props.possibleWordList, 20 );
        const listItems = randomSubsetOfPossibleWords.map( ( word: string ) =>
        {
            return <li key={ word }>{ word }</li>;
        } );

        return (
            <>
                Random sample of possible words:
            <ol>{ listItems }</ol>
            </>
        )
    }
}