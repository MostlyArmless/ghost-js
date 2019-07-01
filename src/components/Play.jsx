import React from 'react';

const ENTER_KEY_CODE = 13;
const initialState = {
  gameString: '',
  nextChar: ''
}
export class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.commitNextChar();
    }
  }

  render() {
    const possibleWordList = this.props.possibleWordList.map((word) => {
      return <li>{word}</li>;
    });

    const bullshitButton = this.props.gameString.length > 0 &&
      <button
        onClick={this.props.onCallBullshit}>
        Call Bullshit on {this.props.getPreviousPlayer().name}
      </button>;

    return (
      <div>
        <h1>Ghost</h1>
        <p>It is currently {this.props.getCurrentPlayer().name}'s turn</p>
        <p>Enter the next character:</p>
        <input
          onChange={this.props.onNextCharChange}
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
        {bullshitButton}
        <p>
          Possible words:
          <ol>
            {possibleWordList}
          </ol>
        </p>
      </div>
    );
  }
}