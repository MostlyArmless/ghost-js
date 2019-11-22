import * as React from 'react';
import { GameOverReason } from '../constants';
import { Player } from '../interfaces';

interface GameOverProps
{
  gameOverReason: GameOverReason;
  losingPlayer: Player;
  winningPlayer: Player;
  gameString: string;
  possibleWordList: string[];
  handleNewGame(): void;
}

export function GameOver( props: GameOverProps )
{
  let loserReason;

  switch ( props.gameOverReason )
  {
    case GameOverReason.finishedWord:
      loserReason = <p>{ props.losingPlayer.name } lost by spelling the word: "{ props.gameString }"</p>;
      break;

    case GameOverReason.noPossibleWords:
      loserReason = <p>{ props.losingPlayer.name } lost because no word starts with "{ props.gameString }"</p>;
      break;

    case GameOverReason.goodBullshitCall:
      loserReason = <p>{ props.losingPlayer.name } lost because { props.winningPlayer.name } correctly called bullshit on them: There are no words that start with "{ props.gameString }"</p>;
      break;

    case GameOverReason.badBullshitCall:
      loserReason = (
        <>
          <p>{ props.losingPlayer.name } lost because they incorrectly called bullshit on { props.winningPlayer.name }.</p>
          <br />
          <p>Here are some words that start with { props.gameString }:</p>
          <ol>
            { props.possibleWordList.map( word =>
            {
              return <li key={ word }>{ word }</li>;
            } ) }
          </ol>
        </>
      );
      break;

    default:
      console.log( props );
      loserReason = <p>Game ended for unknown reason</p>
  }

  return (
    <div className='App'>
      <h1>GAME OVER</h1>
      { loserReason }
      <input
        type='button'
        value='New Game'
        onClick={ props.handleNewGame }
      />
    </div>
  );
}