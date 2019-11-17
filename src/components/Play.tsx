import * as React from 'react';
import { Player } from '../interfaces';

const ENTER_KEY_CODE = 13;
const initialState = {
  gameString: '',
  nextChar: ''
}

export interface PlayState {
  gameString: string;
  nextChar: string;
}

export interface PlayProps {
  handleNextCharChange(event: any): void;
  nextChar: string;
  gameString: string;
  getCurrentPlayer(): Player;
  getPreviousPlayer(): Player;
  commitNextChar(): void;
  possibleWordList: string[];
  handleCallBullshit(): void;
}

export class Play extends React.Component<PlayProps, PlayState> {
  constructor(props: PlayProps) {
    super(props);
    this.state = initialState;
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.commitNextChar();
    }
  }

  render() {
    const possibleWordList = this.props.possibleWordList.map((word: string) => {
      return <li key={word}>{word}</li>;
    });

    const bullshitButton = this.props.gameString.length > 0 &&
      <button
        onClick={this.props.handleCallBullshit}>
        Call Bullshit on {this.props.getPreviousPlayer().name}
      </button>;

    return (
      <div>
        <h1>Ghost</h1>
        <p>It is currently {this.props.getCurrentPlayer().name}'s turn</p>
        <p>Enter the next character:</p>
        <input
          onChange={this.props.handleNextCharChange}
          type='text'
          id='nextChar'
          maxLength={1}
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
        <div>
          Possible words:
          <ol>
            {possibleWordList}
          </ol>
        </div>
      </div>
    );
  }
}