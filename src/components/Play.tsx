import { IPlayer } from '../interfaces';
import { Spinner } from './Spinner';
import { Button } from './Button'
import * as _ from 'underscore';
import { NumberedList } from './NumberedList';

export interface PlayProps
{
    handleNextCharChange( event: any ): void;
    nextChar: string;
    gameString: string;
    getCurrentPlayer(): IPlayer;
    getPreviousPlayer(): IPlayer;
    commitAppendChar(): void;
    commitPrependChar(): void;
    possibleWordList: string[];
    handleCallBullshit(): void;
    handleExitGame(): void;
    displayWordList: boolean;
    waitingForAiToChooseLetter: boolean;
}

export function Play(props: PlayProps) {

    const validateChar = (): boolean =>
    {
        if ( props.nextChar.length === 0 )
        {
            alert( "Can't submit a blank" );
            return false;
        }
        return true;
    }

    const appendChar = () =>
    {
        if (!validateChar())
            return;
        props.commitAppendChar();
    }

    const prependChar = () =>
    {
        if ( !validateChar() )
            return;
        props.commitPrependChar();
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
            <Button
                id={ 2 }
                text="Prepend letter"
                onClick={ prependChar }
            />
            <input
                autoComplete='off'
                onChange={ props.handleNextCharChange }
                type='text'
                id='nextChar'
                maxLength={ 1 }
                value={ props.nextChar }
                width={5}
            />
            <Button
            id={ 2 }
            text="Append letter"
            onClick={appendChar}
            />
            <p>Game String:</p>
            <input
                autoComplete='off'
                value={ props.gameString }
                type='text'
                id='gameString'
                readOnly={ true }
            />
            { props.gameString.length > 0 &&
                <Button
                    onClick={ props.handleCallBullshit }
                    text={ `Call Bullshit on ${props.getPreviousPlayer().name}` }
                    className="wideButton"
                /> }
            { props.displayWordList && buildPossibleWordList() }
        </>
    );
}