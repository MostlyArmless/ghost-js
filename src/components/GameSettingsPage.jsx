import React from 'react';
import { GameSetting } from './GameSetting';

export class GameSettingsPage extends React.Component {

  render() {

    const settings = Object.keys(this.props.gameSettings).map((keyName, item) => {
      
      return (<GameSetting
        key={item.title}
        settingTitle={item.title}
        value={item.value}
        options={item.options}
        handleChangeGameSetting={this.props.handleChangeGameSetting} />
      );
    });

    return (
      <div>
        <table className='center'>
          <tbody>
            {settings}
          </tbody>
        </table>
        <button onClick={this.props.handleSettingsDoneClicked}>Done</button>
      </div>
    );
  }
}