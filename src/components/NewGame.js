import React from 'react';
import { Button } from './Button';
import { NameField } from './NameField';

export class NewGame extends React.Component {
  onListUpdated(list) {
    console.log("Got updated list:", list)
  }

  handleClick = (index, event) => {
    console.log(index, event);
    // this.props.handleStartClicked(event.target.value, index);
  }

  render() {
    const invalidPlayerWarning = <h2>Player names can't be blank</h2>
    const listItems = this.props.list.map((player, id) => {
      return (
        <div key={id+"_div"}>
          <NameField
            player={player}
            id={id}
            handleChangeName={this.props.handleChangeName}/>
          
          <select value={player.type} onChange={this.props.handleChangePlayerType}>
            <option value={'Human'}>Human</option>
            <option value={'AI'}>AI</option>
          </select>

          {id > 0 &&
            <Button
              key={id + '_button'}
              id={id}
              onClick={this.props.handleRemovePlayer}
              text='Delete'
            />
          }
          <br />
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
        <fieldset>
          {listItems}
        </fieldset>
      </div>
    );
  }
}