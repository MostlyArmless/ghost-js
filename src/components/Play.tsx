import * as React from 'react';
import { Player } from '../interfaces';
import { Spinner } from './Spinner';

const ENTER_KEY_CODE = 13;
const initialState: PlayState = {
  gameString: '',
  nextChar: ''
}

export interface PlayState
{
  gameString: string;
  nextChar: string;
}

export interface PlayProps
{
  handleNextCharChange( event: any ): void;
  nextChar: string;
  gameString: string;
  getCurrentPlayer(): Player;
  getPreviousPlayer(): Player;
  commitNextChar(): void;
  possibleWordList: string[];
  handleCallBullshit(): void;
  aiPlaceLetterAndCommit(): void;
}

export class Play extends React.Component<PlayProps, PlayState> {
  constructor( props: PlayProps )
  {
    super( props );
    this.state = initialState;
  }

  onKeyDown = ( event: React.KeyboardEvent<HTMLInputElement> ) =>
  {
    if ( event.keyCode === ENTER_KEY_CODE )
    {
      this.props.commitNextChar();
    }
  }

  render()
  {
    const possibleWordList = this.props.possibleWordList.map( ( word: string ) =>
    {
      return <li key={ word }>{ word }</li>;
    } );

    const bullshitButton = this.props.gameString.length > 0 &&
      <button
        onClick={ this.props.handleCallBullshit }>
        Call Bullshit on { this.props.getPreviousPlayer().name }
      </button>;

    let spinner = this.props.getCurrentPlayer().type == 'AI' &&
      <Spinner
        loading={ this.props.getCurrentPlayer().type == 'AI' }
        onLoadFinished={ this.props.aiPlaceLetterAndCommit } />;

    return (
      <div>
        <h1>Ghost</h1>
        <p>It is currently { this.props.getCurrentPlayer().name }'s turn</p>

        { spinner }

        <p>Enter the next character:</p>
        <input
          autoComplete='off'
          onChange={ this.props.handleNextCharChange }
          type='text'
          id='nextChar'
          maxLength={ 1 }
          onKeyDown={ this.onKeyDown }
          value={ this.props.nextChar }
        />
        <p>Game String:</p>
        <input
          autoComplete='off'
          value={ this.props.gameString }
          type='text'
          id='gameString'
          readOnly={ true }
        />
        { bullshitButton }
        <div>
          Possible words:
          <ol>
            { possibleWordList }
          </ol>
        </div>
      </div>
    );
  }
}