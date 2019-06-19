import React from 'react';
// import './TextBox.css';

const ENTER_KEY_CODE = 13;
const initialState = {
  gameString: '',
  nextChar: ''
}
export class TextBox extends React.Component {
  constructor(props) {
    super();
    this.state = initialState;
  }

  onTextChange = (event) => {
    console.log(`onTextChange ${event.target.value}`);
    this.setState({
      nextChar: event.target.value
    });
  }

  commitNextChar = () => {
    console.log(`committing next char '${this.state.nextChar}'...`);
    this.setState((previousState) => {
      console.log(`commitNextChar thinks previous state was ${JSON.stringify(previousState)}`);
      const newState = {
        gameString: previousState.gameString + previousState.nextChar,
        nextChar: ''
      };
      console.log(`commitNextChar wants to make the next state equal ${JSON.stringify(newState)}`);
      return newState;
    },
      this.props.nextTurn
    );
  }

  componentWillUpdate = () => {
    console.log(`componentWillUpdate thinks the state is '${JSON.stringify(this.state)}'`)
  }

  componentDidUpdate = () => {
    console.log(`componentDidUpdate thinks the state is '${JSON.stringify(this.state)}'`)
  }

  onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      console.log('You hit ENTER');
      this.commitNextChar();
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
          value={this.state.nextChar}
        />
        <p>Game String:</p>
        <input
          value={this.state.gameString}
          type='text'
          id='gameString'
          readOnly={true}
        />
      </div>
    );
  }
}