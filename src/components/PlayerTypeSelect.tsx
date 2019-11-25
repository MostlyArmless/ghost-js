import * as React from 'react';
import { PlayerType } from '../interfaces';

interface PlayerTypeSelectProps
{
  id: number;
  playerType: PlayerType;
  handleChangePlayerType( id: number, value: PlayerType ): void;
}

interface PlayerTypeSelectState
{

}

const initialState: PlayerTypeSelectState = {

}

export class PlayerTypeSelect extends React.Component<PlayerTypeSelectProps, PlayerTypeSelectState> {

  constructor( props: PlayerTypeSelectProps )
  {
    super( props );
    this.state = initialState;
  }

  handleChangePlayerType = ( event: any ) =>
  {
    this.props.handleChangePlayerType( this.props.id, event.target.value );
  }

  render()
  {
    return (
      <>
        <select
          value={ this.props.playerType }
          onChange={ this.handleChangePlayerType }
        >
          <option value={ 'Human' }>Human</option>
          <option value={ 'AI' }>AI</option>
        </select>
      </>
    );
  }
}