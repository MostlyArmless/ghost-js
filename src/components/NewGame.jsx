import React from 'react';
import { Button } from './Button';
import { NameField } from './NameField';
import { PlayerTypeSelect } from './PlayerTypeSelect';

export class NewGame extends React.Component {
  onListUpdated(list) {
    console.log("Got updated list:", list)
  }

  render() {
    const invalidPlayerWarning = <h2>Player names can't be blank</h2>
    const listItems = this.props.list.map((player, id) => {
      return (
        <div key={id+"_div"}>
          <NameField
            playerName={player.name}
            id={id}
            handleChangeName={this.props.handleChangeName}/>
          
          <PlayerTypeSelect
            id={id}
            playerType={player.type}/>

          {id > 0 &&
            <Button
              key={id + '_button'}
              id={id}
              onClick={this.props.handleRemovePlayer}
              text='Delete'
            />
          }
        </div>
      );
    })

    return (
      <div>
        <h1>Choose Players</h1>
        {this.props.invalidPlayerNames && invalidPlayerWarning}
        <button
          onClick={this.props.reset}>
          Reset Game
        </button>
        <button
          className='startGame'
          onClick={this.props.handleStartClicked}>
          Start Game
        </button>
        <button onClick={this.props.handleSettingsClicked}>Settings</button>
        <fieldset>
          {listItems}
          <button
            onClick={this.props.handleAddPlayer}>
            Add Player
        </button>
        </fieldset>
      </div>
    );
  }
}