import React from 'react';
// import './TextBox.css';

const ENTER_KEY_CODE = 13;

class NextCharacterTextBox extends React.Component {	
	constructor(props) {
		super();
		this.state = {
			game_string: '',
			next_char: ''
		}
	}

	onTextChange = (event) => {
		this.setState({next_char: event.target.value})
	}

	componentDidUpdate() {
		// Check for a winner
		if (this.props.checkForWord(this.state.game_string)) {
			console.log('HOLY SHIT ITS A WORD');
		}
		else {
			console.log("no word yet");
		}
	}

	commitNextChar = () => {
		this.setState((previousState) => {
			return {
				game_string: previousState.game_string + previousState.next_char,
				next_char: ''
			}
		});
	}

	onKeyDown = (event) => {
		if (event.keyCode === ENTER_KEY_CODE) {
			this.commitNextChar();
			this.props.nextTurn();
		}
	}

	render() {
		return (
			<div>
				<p>Enter the next character:</p>
				<input
					onChange={this.onTextChange}
					type='text'
					id='next_char'
					maxLength='1'
					onKeyDown={this.onKeyDown}
					value={this.state.next_char}
				/>
				<p>Game String:</p>
				<input
					value={this.state.game_string}
					type='text'
					id='game_string'
					readOnly={true}
				/>
			</div>
		);
	}
}

export default NextCharacterTextBox;