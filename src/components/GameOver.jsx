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
    default:
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