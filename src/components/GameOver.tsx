import * as React from 'react';
import { GameOverReason, ENTER_KEY_CODE } from '../constants';
import { Player } from '../interfaces';
import { Button } from './Button';
import { RemovableWord } from './RemovableWord';
import { TextboxAndButton } from './TextboxAndButton';

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

}

const initialState: GameOverState =
{

}

export class GameOver extends React.Component<GameOverProps, GameOverState>
{
    constructor( props: GameOverProps )
    {
        super( props );
        this.state = initialState;
    }

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

    submitWordToWhitelist = async ( word: string ) =>
    {
        if ( word.length === 0 )
        {
            alert( "Can't add blank word to dictionary" );
            return;
        }
        if ( await this.props.isWordInDictionary( word, 50 ) )
        {
            alert( "This word is already in the dictionary!" );
            return;
        }

        this.props.addToWhitelist( word );
        alert( `Added "${word}" to dictionary for future games` );
    }

    render()
    {
        const loserReason = this.buildLoserReason();

        const addToBlacklistButton = this.props.gameOverReason === GameOverReason.finishedWord &&
            <Button
                text='Blacklist Word'
                onClick={ this.addToBlacklist }
            />

        const addToWhitelistTextbox = this.props.gameOverReason === GameOverReason.goodBullshitCall &&
            <TextboxAndButton
                onSubmit={ this.submitWordToWhitelist }
                buttonText="Add to Dictionary"
            />

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

    private buildLoserReason()
    {
        switch ( this.props.gameOverReason )
        {
            case GameOverReason.finishedWord:
                return <p>{ this.props.losingPlayer.name } lost by spelling the word: "{ this.props.gameString }"</p>;

            case GameOverReason.noPossibleWords:
                return <p>{ this.props.losingPlayer.name } lost because no word starts with "{ this.props.gameString }"</p>;

            case GameOverReason.goodBullshitCall:
                return <p>{ this.props.losingPlayer.name } lost because { this.props.winningPlayer.name } correctly called bullshit on them<br />There are no words that start with "{ this.props.gameString }"</p>;

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