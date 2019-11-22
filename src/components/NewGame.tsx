import React from 'react';
import { Button } from './Button';
import { NameField } from './NameField';
import { Player, PlayerType } from '../interfaces';
import { PlayerTypeSelect } from './PlayerTypeSelect';

interface NewGameProps
{
  playerList: Player[];
  handleRenamePlayer( index: number, newName: string ): void;
  handleChangePlayerType( index: number, newType: PlayerType ): void;
  handleAddPlayer(): void;
  handleRemovePlayer( index: number ): void;
  handleStartClicked(): void;
  reset(): void;
  handleSettingsClicked(): void;
  invalidPlayerNames: boolean;
  getBlacklist(): Promise<string[]>;
  getWhitelist(): Promise<string[]>;
}

interface NewGameState
{
  blacklistVisible: boolean;
  whitelistVisible: boolean;
}

const initialState: NewGameState = {
  blacklistVisible: false,
  whitelistVisible: false
}

export class NewGame extends React.Component<NewGameProps, NewGameState> {

  constructor( props: NewGameProps )
  {
    super( props );
    this.state = initialState;
  }

  toggleBlacklistVisibility = () =>
  {
    this.setState( ( previousState ) =>
    {
      return { blacklistVisible: !previousState.blacklistVisible };
    } );
  }

  toggleWhitelistVisibility = () =>
  {
    this.setState( ( previousState ) =>
    {
      return { whitelistVisible: !previousState.whitelistVisible };
    } );
  }

  buildBlacklist = async () =>
  {
    return (
      <>
        <p>Blacklisted words:</p>
        <ol>
          { ( await this.props.getBlacklist() ).map( ( word: string ) => { return <li key={ word }>{ word }</li>; } ) }
        </ol>
      </>
    );
  }

  buildWhitelist = async () =>
  {
    return (
      <>
        <p>Blacklisted words:</p>
        <ol>
          { ( await this.props.getWhitelist() ).map( ( word: string ) => { return <li key={ word }>{ word }</li>; } ) }
        </ol>
      </>
    );
  }

  render()
  {
    const invalidPlayerWarning = <h2>Player names can't be blank</h2>
    const listItems = this.props.playerList.map( ( player, id ) =>
    {
      return (
        <div key={ id + "_div" }>
          <NameField
            playerName={ player.name }
            id={ id }
            handleChangeName={ this.props.handleRenamePlayer } />

          <PlayerTypeSelect
            id={ id }
            playerType={ player.type }
            handleChangePlayerType={ this.props.handleChangePlayerType } />

          { id > 0 &&
            <Button
              key={ id + '_button' }
              id={ id }
              onClick={ this.props.handleRemovePlayer }
              text='Delete'
            />
          }
        </div>
      );
    } )

    const blacklist = this.state.blacklistVisible && this.buildBlacklist();

    const whitelist = this.state.whitelistVisible && this.buildWhitelist();

    return (
      <div className='newGame'>
        <h1>Choose Players</h1>
        { this.props.invalidPlayerNames && invalidPlayerWarning }
        <Button
          onClick={ this.props.reset }
          text='Reset Game'
        />
        <Button
          className='startGame'
          onClick={ this.props.handleStartClicked }
          text='Start Game'
        />
        <Button
          onClick={ this.props.handleSettingsClicked }
          text='Settings'
        />
        <Button
          onClick={ this.toggleBlacklistVisibility }
          text={ this.state.blacklistVisible ? 'Hide Blacklist' : 'Show Blacklist' }
        />
        <Button
          onClick={ this.toggleWhitelistVisibility }
          text={ this.state.whitelistVisible ? 'Hide Whitelist' : 'Show Whitelist' }
        />
        <fieldset>
          { listItems }
          <button
            onClick={ this.props.handleAddPlayer }>
            Add Player
        </button>
        </fieldset>
        { blacklist }
        { whitelist }
      </div>
    );
  }
}