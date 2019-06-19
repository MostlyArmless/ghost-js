import React, { Component } from 'react';
import './App.css';
import { Play } from './components/Play';
import { GameOver } from './components/GameOver';

const initialState = {
  gameState: 'playing',
  gameOptions: {
    numAiPlayers: 1,
    numHumanPlayers: 1
  },
  players: [
    "Player A",
    "Player B"
  ],
  nextChar: '',
  gameString: '',
  currentPlayerIndex: 0,
  wordDict: new Set([
    'apple',
    'app',
    'apres',
    'apringle',
    'banana',
    'coin',
    'disaster',
    'epilepsy',
    'francophone',
    'gash',
    'hate',
    'ilk',
    'jest',
    'killarney',
    'lemon',
    'mongoose',
    'niagra',
    'operation',
    'pestilence',
    'quetzlcoatl',
    'rabid',
    'set',
    'tupperware',
    'uppercut',
    'volvo',
    'wiggle',
    'xylophone',
    'yarn',
    'zed'])
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  gameOver(updatedGameString) {
    console.log('Game over...');
    this.setState({
      gameState: 'gameOver',
      gameString: updatedGameString
    })
  }

  commitNextChar = () => {
    console.log(`committing next char '${this.state.nextChar}'...`);
    const updatedGameString = this.state.gameString + this.state.nextChar;
    
    if (this.checkForWord(updatedGameString)) {
      // The last player spelled a word, so it's game over
      this.gameOver(updatedGameString);
    }
    else {
      this.nextTurn(updatedGameString);
    }
  }

  checkForWord = (testWord) => {
    console.log(`Checking for word '${testWord}'...`);
    return this.state.wordDict.has(testWord);
  }

  nextTurn = (updatedGameString) => {
      this.setState((previousState) => {
        return ({
        currentPlayerIndex: (previousState.currentPlayerIndex + 1) % 2,
        nextChar: '',
        gameString: updatedGameString
        });
      });
    }

  getCurrentPlayer = () => {
    console.log('Get current player...');
    return this.state.players[this.state.currentPlayerIndex];
  }

  resetGame = () => {
    console.log('Resetting game...');
    this.setState(initialState);
  }

  onTextChange = (event) => {
    console.log(`onTextChange ${event.target.value}`);
    this.setState({
      nextChar: event.target.value
    });
  }

  render() {
    let page = <h1>Ghost Game</h1>;

    switch (this.state.gameState) {
      case 'playing':
        page = <Play
          onTextChange={this.onTextChange}
          nextChar={this.state.nextChar}
          gameString={this.state.gameString}
          getCurrentPlayer={this.getCurrentPlayer}
          commitNextChar={this.commitNextChar}
          wordDict={this.state.wordDict}/>;
        break;
      case 'gameOver':
        page = 
          <GameOver
            losingPlayer={this.getCurrentPlayer()}
            gameString={this.state.gameString}
            handleClick={this.resetGame}/>
        break;
      default:
        page = (<p>Invalid gameState.</p>);
    }

    return (
      <div className='App'>
        {page}
      </div>
    );
  }
}

export default App;
