import * as React from 'react';
import { IPlayer } from '../interfaces';
import { Spinner } from './Spinner';
import { Button } from './Button'
import * as _ from 'underscore';
import { ENTER_KEY_CODE } from '../constants';
import { NumberedList } from './NumberedList';

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

export function Play(props: PlayProps) {

    const submitChar = () =>
    {
        if ( props.nextChar.length === 0 )
        {
            alert( "Can't submit a blank" );
            return;
        }
        props.commitNextChar();
    }
    
    const onKeyDown = ( event: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( event.keyCode === ENTER_KEY_CODE )
            submitChar();
    }

    
    const buildPossibleWordList = () =>
    {
        const randomSubsetOfPossibleWords: string[] = _.sample( props.possibleWordList, 20 );

        return (
            <>
                <br />
                Random sample of possible words starting with "{props.gameString}":
                {
                randomSubsetOfPossibleWords.length > 0
                    ? <NumberedList data={ randomSubsetOfPossibleWords } />
                    : <p>NO WORDS START WITH THESE LETTERS!</p>
                }
            </>
        )
    }

    const possibleWordListForDisplay = props.displayWordList && buildPossibleWordList();

    const bullshitButton = props.gameString.length > 0 &&
        <Button
            onClick={ props.handleCallBullshit }
            text={ `Call Bullshit on ${props.getPreviousPlayer().name}` }
            className="wideButton"
        />;

    return (
        <>
            <h1>Ghost</h1>
            <Button
                id={ 1 }
                onClick={ props.handleExitGame }
                text='Quit Game'
            />
            <p>It is currently { props.getCurrentPlayer().name }'s turn</p>

            <Spinner
                loading={ props.waitingForAiToChooseLetter }
            />

            <p>Enter the next character:</p>
            <input
                autoComplete='off'
                onChange={ props.handleNextCharChange }
                type='text'
                id='nextChar'
                maxLength={ 1 }
                onKeyDown={ onKeyDown }
                value={ props.nextChar }
                width={5}
            />
            <Button
            id={ 2 }
            text="Submit letter"
            onClick={submitChar}
            />
            <p>Game String:</p>
            <input
                autoComplete='off'
                value={ props.gameString }
                type='text'
                id='gameString'
                readOnly={ true }
            />
            { bullshitButton }
            { possibleWordListForDisplay }
        </>
    );
}