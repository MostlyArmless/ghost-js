import React, { Component } from 'react';
import './App.css';
import { Play } from './components/Play';
import { GameOver } from './components/GameOver';
import { NewGame } from './components/NewGame';
import { GameSettingsPage } from './components/GameSettingsPage';
import { checkForWord, getPossibleWords } from './API'

const initialState = {
  gameState: 'newGame',
  previousGameState: 'newGame',
  invalidPlayerNames: false,
  players: [
    { name: "Borg", type: "AI" },
    { name: "Mike", type: "Human" },
    { name: "Jane", type: "Human" }
  ],
  gameSettings: {
    minimumWordLength: {
      title: "Minimum Word Length",
      value: 4,
      options: [3,4,5,6]
    },
    maxNumPlayers: {
      title: "Maximum Number of Players",
      value: 4,
      options: [3,4,5]
    },
    wordRecognitionMode: {
      title: "Word Recognition Mode",
      value: 'auto',
      options: ['auto','manual']
    },
  },
  nextChar: '',
  gameString: '',
  currentPlayerIndex: 0,
  gameOverReason: '',
  possibleWordList: [],
  loser: {},
  winner: {}
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  gameOver(updatedGameString, gameOverReason) {
    console.log(`Game over because ${gameOverReason}...`);
    this.setState({
      gameState: 'gameOver',
      gameString: updatedGameString,
      gameOverReason: gameOverReason
    });
  }

  commitNextChar = async () => {
    console.log(`committing next char '${this.state.nextChar}'...`);
    const updatedGameString = this.state.gameString + this.state.nextChar;
    
    // Ask the server for a list of all words that start with the current game string
    if (updatedGameString.length >= this.state.gameSettings.minimumWordLength.value - 1) {
      const possibleWordList = await getPossibleWords(updatedGameString);
      if (possibleWordList.length > 0) {
        this.setState({
          possibleWordList: possibleWordList
        });
      }
      else {
        this.gameOver(updatedGameString, 'noPossibleWords');
        return;
      }
    }

    if (this.state.gameString.length >= this.state.gameSettings.minimumWordLength && await checkForWord(updatedGameString)) {
      if (this.state.wordRecognitionMode) {
        alert("Bullshit!");
      }
      else {
        // The last player spelled a word, so it's game over
        this.gameOver(updatedGameString, 'finishedWord');
      }
    }
    else {
      this.nextTurn(updatedGameString);
    }
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

  getPreviousPlayer = () => {
    const previousPlayerIndex = this.state.currentPlayerIndex === 0 ? this.state.players.length - 1 : this.state.currentPlayerIndex - 1;
    return this.state.players[previousPlayerIndex];
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

  handleChangeGameSetting = (settingName, value) => {
    this.setState((previousState) => {
      let newSettings = previousState.gameSettings;
      const settingIndex = newSettings.findIndex((setting) => {
        return setting.title === settingName;
      });
      newSettings[settingIndex].value = value;
      console.log(newSettings);
      return {
        gameSettings: newSettings
      }
    });
  }

  handleAddPlayer = () => {
    this.setState((previousState) => {
      return {
        players: previousState.players.concat({
          name: 'New Player',
          type: "Human"
        })
      }
    })
  }

  handleRemovePlayer = (index) => {
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

  handleCallBullshit = async () => {
    const possibleWordList = await getPossibleWords(this.state.gameString);
    if (possibleWordList.length > 0) {
      this.setState({
        gameState: 'gameOver',
        gameOverReason: 'badBullshitCall',
        loser: this.getCurrentPlayer(),
        winner: this.getPreviousPlayer(),
        possibleWordList: possibleWordList
      });
    }
    else {
      this.setState({
        gameState: 'gameOver',
        gameOverReason: 'goodBullshitCall',
        loser: this.getPreviousPlayer(),
        winner: this.getCurrentPlayer()
      });
    }
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
          getPreviousPlayer={this.getPreviousPlayer}
          commitNextChar={this.commitNextChar}
          possibleWordList={this.state.possibleWordList}
          onCallBullshit={this.handleCallBullshit}/>;
        break;
      case 'gameOver':
        page =
          <GameOver
            losingPlayer={this.state.loser}
            winningPlayer={this.state.winner}
            gameString={this.state.gameString}
            gameOverReason={this.state.gameOverReason}
            handleClick={this.resetGame}
            possibleWordList={this.state.possibleWordList}/>
        break;
      case 'settings':
        page = <GameSettingsPage
          gameSettings={this.state.gameSettings}
          handleChangeGameSetting={this.handleChangeGameSetting}
          handleSettingsDoneClicked={this.handleSettingsDoneClicked} />;
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
