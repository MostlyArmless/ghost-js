import React, { Component } from 'react';
import './App.css';
import { Play } from './components/Play';
import { GameOver } from './components/GameOver';
import { NewGame } from './components/NewGame';
import { GameSettings } from './components/GameSettings';

const initialState = {
  gameState: 'newGame',
  invalidPlayerNames: false,
  players: [
    { name: "Borg", type: "AI" },
    { name: "Mike", type: "Human" },
    { name: "Jane", type: "Human" }
  ],
  gameSettings: {
    minWordLength: 4,
    maxNumPlayers: 4
  },
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

  handleNextCharChange = (event) => {
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

  handleChangePlayerType = (index, newType) => {
    this.setState((previousState) => {
      const players = previousState.players;
      players[index].type = newType;
      return {
        players: players
      }
    })
  }

  handleChangeMinWordLength = (value) => {
    this.setState((previousState) => {
      let newSettings = previousState.gameSettings;
      newSettings.minWordLength = value;
      console.log(newSettings);
      return {
        gameSettings: newSettings
      }
    })
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

  handleSettingsClicked = () => {
    this.setState((previousState) => {
      return {
        previousGameState: previousState.gameState,
        gameState: 'settings'
      }
    });
  }

  handleSettingsDoneClicked = () => {
    this.setState((previousState) => {
      return {
        gameState: previousState.previousGameState,
        previousGameState: 'settings'
      }
    })
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
          handleSettingsClicked={this.handleSettingsClicked}
        />;
        break;
      case 'playing':
        page = <Play
          onNextCharChange={this.handleNextCharChange}
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
      case 'settings':
        page = <GameSettings
          gameSettings={this.state.gameSettings}
          handleChangeMinWordLength={this.handleChangeMinWordLength}
          handleSettingsDoneClicked={this.handleSettingsDoneClicked}/>;
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
