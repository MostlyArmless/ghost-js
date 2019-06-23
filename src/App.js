import React, { Component } from 'react';
import './App.css';
import { Play } from './components/Play';
import { GameOver } from './components/GameOver';
import { NewGame } from './components/NewGame';

const initialState = {
  gameState: 'newGame',
  invalidPlayerNames: false,
  players: [
    { name: "Borg", type: "AI" },
    { name: "Mike", type: "Human" },
    { name: "Jane", type: "Human" }
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
      const numPlayers = this.state.players.length;
      return ({
        currentPlayerIndex: (previousState.currentPlayerIndex + 1) % numPlayers,
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

  handleTextChange = (event) => {
    console.log(`onTextChange ${event.target.value}`);
    this.setState({
      nextChar: event.target.value
    });
  }

  handleStartClicked = () => {
    for (let i = 0; i < this.state.players.length; i++) {
      const name = this.state.players[i].name;
      if (name.length === 0) {
        this.setState({
          invalidPlayerNames: true
        });
        return;
      }
    }
    
    this.setState({
      invalidPlayerNames: false,
      gameState: 'playing'
    })
  }

  handleChangeName = (index, newName) => {
    console.log(index);
    console.log(newName);
    this.setState((previousState) => {
      const newPlayerList = previousState.players;
      newPlayerList[index].name = newName;
      return {
        players: newPlayerList
      }
    });
  }

  handleChangePlayerType = () => {
    console.log('NOT YET IMPLEMENTED');
  }

  handleAddPlayer = () => {
    this.setState((previousState) => {
      return {
        players: previousState.players.concat({
          name:'New Player',
          type: "Human"
        })
      }
    })
  }
  handleRemovePlayer = (index) => {
    // console.log(`Remove player:\n${JSON.stringify(index)}`);
    this.setState((previousState) => {
      const players = previousState.players;
      players.splice(index, 1);
      return {
        players: players
      }
    });
  }

  render() {
    let page = <h1>Ghost Game</h1>;

    switch (this.state.gameState) {
      case 'newGame':
        page = <NewGame
          list={this.state.players}
          handleChangeName={this.handleChangeName}
          handleChangePlayerType={this.handleChangePlayerType}
          handleRemovePlayer={this.handleRemovePlayer}
          handleStartClicked={this.handleStartClicked}
          invalidPlayerNames={this.state.invalidPlayerNames}
          handleAddPlayer={this.handleAddPlayer}
          reset={this.resetGame}
        />;
        break;
      case 'playing':
        page = <Play
          onTextChange={this.handleTextChange}
          nextChar={this.state.nextChar}
          gameString={this.state.gameString}
          getCurrentPlayer={this.getCurrentPlayer}
          commitNextChar={this.commitNextChar}
          wordDict={this.state.wordDict} />;
        break;
      case 'gameOver':
        page =
          <GameOver
            losingPlayer={this.getCurrentPlayer()}
            gameString={this.state.gameString}
            handleClick={this.resetGame} />
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
