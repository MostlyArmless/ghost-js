import React from 'react';

const ENTER_KEY_CODE = 13;
const initialState = {
  gameString: '',
  nextChar: ''
}
export class Play extends React.Component {
  constructor(props) {
    super();
    this.state = initialState;
  }

  onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      console.log('You hit ENTER');
      this.props.commitNextChar();
    }
  }

  render() {
    return (
      <div>
        <h1>Ghost</h1>
        <p>It is currently {this.props.getCurrentPlayer().name}'s turn</p>
        <p>Enter the next character:</p>
        <input
          onChange={this.props.onTextChange}
          type='text'
          id='nextChar'
          maxLength='1'
          onKeyDown={this.onKeyDown}
          value={this.props.nextChar}
        />
        <p>Game String:</p>
        <input
          value={this.props.gameString}
          type='text'
          id='gameString'
          readOnly={true}
        />
      </div>
    );
  }
}