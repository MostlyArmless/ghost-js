import React, { Component } from 'react';
import './App.css';
import TextBox from './components/TextBox';

class App extends Component {
	constructor() {
		super();

		this.state = {
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
		
	}

	checkForWord = (testWord) => {
		return this.state.wordDict.has(testWord);
	}

	nextTurn = () => {
		this.setState((previousState) => {
			return {
				currentPlayerIndex: (previousState.currentPlayerIndex + 1) % 2
			}
		})
	}

	getCurrentPlayer = () => {
		console.log(this.state.currentPlayerIndex)
		return this.state.players[this.state.currentPlayerIndex];
	}

	render() {
		return (
			<div className="App">
				<p>Ghost Game</p>
				<p>It is currently {this.getCurrentPlayer()}'s turn</p>
				<TextBox
					checkForWord={this.checkForWord}
					nextTurn={this.nextTurn}
					/>
			</div>
		);
	}
}

export default App;
