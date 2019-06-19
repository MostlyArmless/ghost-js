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

  gameOver() {
    console.log('Game over...');
    this.setState({
      gameState: 'gameOver'
    })
  }

  checkForWord = (testWord) => {
    console.log(`Checking for word '${testWord}'...`);
    return this.state.wordDict.has(testWord);
  }

  nextTurn = (updatedGameString) => {
    console.log(`Calculating next turn with word '${updatedGameString}'`);
    if (this.checkForWord(updatedGameString)) {
      // The last player spelled a word, so it's game over
      this.gameOver();
    }
    else {
      this.setState((previousState) => {
        return ({
          currentPlayerIndex: (previousState.currentPlayerIndex + 1) % 2
        });
      });
    }
  }

  getCurrentPlayer = () => {
    console.log('Get current player...');
    return this.state.players[this.state.currentPlayerIndex];
  }

  resetGame = () => {
    console.log('Resetting game...');
    this.setState(initialState);
  }

  render() {
    let page = <h1>Ghost Game</h1>;

    switch (this.state.gameState) {
      case 'playing':
        page = <Play
          getCurrentPlayer={this.getCurrentPlayer}/>;
        break;
      case 'gameOver':
        page += (
          <GameOver
            handleClick={this.resetGame}/>
        );
        break;
      default:
        return (<p>Invalid gameState.</p>);
    }
    return page;
  }
}

export default App;
