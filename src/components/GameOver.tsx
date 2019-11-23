import * as React from 'react';
import { GameOverReason } from '../constants';
import { Player } from '../interfaces';
import { Button } from './Button';

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
}

interface GameOverState
{

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

    render()
    {
        let loserReason;

        switch ( this.props.gameOverReason )
        {
            case GameOverReason.finishedWord:
                loserReason = <p>{ this.props.losingPlayer.name } lost by spelling the word: "{ this.props.gameString }"</p>;
                break;

            case GameOverReason.noPossibleWords:
                loserReason = <p>{ this.props.losingPlayer.name } lost because no word starts with "{ this.props.gameString }"</p>;
                break;

            case GameOverReason.goodBullshitCall:
                loserReason = <p>{ this.props.losingPlayer.name } lost because { this.props.winningPlayer.name } correctly called bullshit on them: There are no words that start with "{ this.props.gameString }"</p>;
                break;

            case GameOverReason.badBullshitCall:
                loserReason = (
                    <>
                        <p>{ this.props.losingPlayer.name } lost because they incorrectly called bullshit on { this.props.winningPlayer.name }.</p>
                        <br />
                        <p>Here are some words that start with { this.props.gameString }:</p>
                        <ol>
                            { this.props.possibleWordList.map( word =>
                            {
                                return <li key={ word }>{ word }</li>;
                            } ) }
                        </ol>
                    </>
                );
                break;

            default:
                console.log( this.props );
                loserReason = <p>Game ended for unknown reason</p>
        }

        const addToBlacklistButton = this.props.gameOverReason === GameOverReason.finishedWord &&
            <Button
                text={ `Remove ${ this.props.gameString } from dictionary` }
                onClick={ this.addToBlacklist }
            />

        const addToWhitelistButton = this.props.gameOverReason === GameOverReason.goodBullshitCall &&
            <Button
                text={ `Add ${ this.props.gameString } to dictionary` }
                onClick={ this.addToWhitelist }
            />

        return (
            <div className='App'>
                <h1>GAME OVER</h1>
                { loserReason }
                <Button
                    text='New Game'
                    onClick={ this.props.handleNewGame }
                />
                { addToBlacklistButton }
                { addToWhitelistButton }
            </div>
        );
    }

}