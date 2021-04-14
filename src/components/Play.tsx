import * as React from 'react';
import { IPlayer } from '../interfaces';
import { Spinner } from './Spinner';
import { Button } from './Button'
import * as _ from 'underscore';
import { ENTER_KEY_CODE } from '../constants';
import { NumberedList } from './NumberedList';

const initialState: PlayState = {
}

export interface PlayState
{
}

export interface PlayProps
{
    handleNextCharChange( event: any ): void;
    nextChar: string;
    gameString: string;
    getCurrentPlayer(): IPlayer;
    getPreviousPlayer(): IPlayer;
    commitNextChar(): void;
    possibleWordList: string[];
    handleCallBullshit(): void;
    handleExitGame(): void;
    displayWordList: boolean;
    waitingForAiToChooseLetter: boolean;
}

export class Play extends React.Component<PlayProps, PlayState> {
    constructor( props: PlayProps )
    {
        super( props );
        this.state = initialState;
    }

    submitChar = () =>
    {
        if ( this.props.nextChar.length === 0 )
        {
            alert( "Can't submit a blank" );
            return;
        }
        this.props.commitNextChar();
    }
    
    onKeyDown = ( event: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( event.keyCode === ENTER_KEY_CODE )
            this.submitChar();
    }

    render()
    {
        const possibleWordListForDisplay = this.props.displayWordList && this.buildPossibleWordList();

        const bullshitButton = this.props.gameString.length > 0 &&
            <Button
                onClick={ this.props.handleCallBullshit }
                text={ `Call Bullshit on ${this.props.getPreviousPlayer().name}` }
                className="wideButton"
            />;

        return (
            <>
                <h1>Ghost</h1>
                <Button
                    id={ 1 }
                    onClick={ this.props.handleExitGame }
                    text='Quit Game'
                />
                <p>It is currently { this.props.getCurrentPlayer().name }'s turn</p>

                <Spinner
                    loading={ this.props.waitingForAiToChooseLetter }
                />

                <p>Enter the next character:</p>
                <input
                    autoComplete='off'
                    onChange={ this.props.handleNextCharChange }
                    type='text'
                    id='nextChar'
                    maxLength={ 1 }
                    onKeyDown={ this.onKeyDown }
                    value={ this.props.nextChar }
                    width={5}
                />
                <Button
                id={ 2 }
                text="Submit letter"
                onClick={this.submitChar}
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

        return (
            <>
                <br />
                Random sample of possible words starting with "{this.props.gameString}":
                {
                randomSubsetOfPossibleWords.length > 0
                    ? <NumberedList data={ randomSubsetOfPossibleWords } />
                    : <p>NO WORDS START WITH THESE LETTERS!</p>
                }
            </>
        )
    }
}