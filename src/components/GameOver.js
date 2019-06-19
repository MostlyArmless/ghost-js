import React from 'react';

export function GameOver(props) {
  return (
    <div className='App'>
      <p>GAME OVER</p>
      <input
        type='button'
        value='New Game'
        onClick={this.props.handleClick}
      />
    </div>
  );
}