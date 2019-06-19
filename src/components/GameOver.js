import React from 'react';

export function GameOver(props) {
  return (
    <div className='App'>
      <h1>GAME OVER</h1>
      <p>{props.losingPlayer} lost by spelling: "{props.gameString}"</p>
      <input
        type='button'
        value='New Game'
        onClick={props.handleClick}
      />
    </div>
  );
}