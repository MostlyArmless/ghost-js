import * as React from 'react';
import { GameOverReason, ENTER_KEY_CODE } from '../constants';
import { Player } from '../interfaces';
import { Button } from './Button';
import { RemovableWord } from './RemovableWord';

interface GameOverProps
{
    gameOverReason: GameOverReason;
    losingPlayer: Player;
    winningPlayer: Player;
    gameString: string;
    possibleWordList: string[];
    handleNewGame(): void;
    addToBlacklist( word: string ): void;
    addToWhitelist( word: string ): void;
    isWordInDictionary( testWord: string, minWordLength: number ): Promise<boolean>;
}

interface GameOverState
{
    wordToWhitelist: string;
}

const initialState: GameOverState = {
    wordToWhitelist: ''
}

export class GameOver extends React.Component<GameOverProps, GameOverState>
{
    addToBlacklist = () =>
    {
        this.props.addToBlacklist( this.props.gameString );
    }

    addToWhitelist = () =>
    {
        this.props.addToWhitelist( this.props.gameString );
    }

    handleWhitelistTextChange = ( event: any ) =>
    {
        this.setState( { wordToWhitelist: event.target.value } );
    }

    onKeyDown = async ( event: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( event.keyCode === ENTER_KEY_CODE )
        {
            if ( this.state.wordToWhitelist.length === 0 )
            {
                alert( "Can't add blank word to dictionary" );
                return;
            }
            if ( await this.props.isWordInDictionary( this.state.wordToWhitelist, 50 ) )
            {
                alert( "This word is already in the dictionary!" );
                return;
            }

            this.props.addToWhitelist( this.state.wordToWhitelist );
        }
    }

    render()
    {
        const loserReason = this.buildLoserReason();

        const addToBlacklistButton = this.props.gameOverReason === GameOverReason.finishedWord &&
            <Button
                text={ `Remove ${this.props.gameString} from dictionary` }
                onClick={ this.addToBlacklist }
            />

        const addToWhitelistTextbox = this.props.gameOverReason === GameOverReason.goodBullshitCall && this.buildWhitelistTextbox();

        return (
            <div className='App'>
                <h1>GAME OVER</h1>
                <Button
                    text='New Game'
                    onClick={ this.props.handleNewGame }
                />
                { loserReason }
                { addToBlacklistButton }
                { addToWhitelistTextbox }
            </div>
        );
    }


    private buildWhitelistTextbox()
    {
        return ( <input
            autoComplete='off'
            onChange={ this.handleWhitelistTextChange }
            type='text'
            id='addToWhitelist'
            maxLength={ 50 }
            onKeyDown={ this.onKeyDown }
            value={ this.state.wordToWhitelist }
        /> );
    }

    private buildLoserReason()
    {
        switch ( this.props.gameOverReason )
        {
            case GameOverReason.finishedWord:
                return <p>{ this.props.losingPlayer.name } lost by spelling the word: "{ this.props.gameString }"</p>;

            case GameOverReason.noPossibleWords:
                return <p>{ this.props.losingPlayer.name } lost because no word starts with "{ this.props.gameString }"</p>;

            case GameOverReason.goodBullshitCall:
                return <p>{ this.props.losingPlayer.name } lost because { this.props.winningPlayer.name } correctly called bullshit on them: There are no words that start with "{ this.props.gameString }"</p>;

            case GameOverReason.badBullshitCall:
                return ( <>
                    <p>{ this.props.losingPlayer.name } lost because they incorrectly called bullshit on { this.props.winningPlayer.name }.</p>
                    <br />
                    <p>Here are some words that start with { this.props.gameString }:</p>
                    <ol>
                        { this.props.possibleWordList.map( word =>
                        {
                            return ( <li key={ word }>
                                <RemovableWord
                                    word={ word }
                                    handleRemoveWord={ this.props.addToBlacklist }
                                />
                            </li> );
                        } ) }
                    </ol>
                </> );

            default:
                console.log( this.props );
                return <p>Game ended for unknown reason</p>;
        }
    }
}