import React from 'react';

export function GameOver(props) {
  let loserReason;

  switch (props.gameOverReason) {
    case 'finishedWord':
      loserReason = <p>{props.losingPlayer.name} lost by spelling the word: "{props.gameString}"</p>;
      break;

    case 'noPossibleWords':
      loserReason = <p>{props.losingPlayer.name} lost because no word starts with "{props.gameString}"</p>;
      break;

    case 'goodBullshitCall':
      loserReason = <p>{props.losingPlayer.name} lost because {props.winningPlayer.name} correctly called bullshit on them: There are no words that start with "{props.gameString}"</p>;
      break;

    case 'badBullshitCall':
      loserReason = (
      <>
        <p>{props.losingPlayer.name} lost because they incorrectly called bullshit on {props.winningPlayer.name}.</p>
        <br/>
        <p>Here are some words that start with {props.gameString}:</p>
        <ol>
          {props.possibleWordList.map(word => {
            return <li>{word}</li>;
          })}
        </ol>
      </>
      );
      break;

    default:
      console.log(props);
      loserReason = <p>Game ended for unknown reason</p>
  }
  
  return (
    <div className='App'>
      <h1>GAME OVER</h1>
      {loserReason}
      <input
        type='button'
        value='New Game'
        onClick={props.handleClick}
      />
    </div>
  );
}