import * as React from 'react';
import { GameSetting } from './GameSetting';
import { GameSettings, GameSettingKey } from '../interfaces';

interface GameSettingsPageProps
{
  gameSettings: GameSettings;
  handleChangeGameSetting( settingName: GameSettingKey, newValue: number | string ): void;
  handleSettingsDoneClicked(): void;
}

interface GameSettingsPageState
{

}

export class GameSettingsPage extends React.Component<GameSettingsPageProps, GameSettingsPageState> {

  render()
  {
    let settings: any[] = [];

    for ( let settingKey in this.props.gameSettings )
    {
      if ( this.props.gameSettings.hasOwnProperty( settingKey ) )
      {
        const item = this.props.gameSettings[settingKey];
        settings.push(
          <GameSetting
            key={ item.settingKey }
            settingKey={ item.settingKey }
            settingTitle={ item.title }
            value={ item.value }
            options={ item.options }
            handleChangeGameSetting={ this.props.handleChangeGameSetting }
          /> );
      }
    }

    return (
      <>
        <h2>Game Settings</h2>
        <table className='center'>
          <tbody>
            { settings }
          </tbody>
        </table>
        <button onClick={ this.props.handleSettingsDoneClicked }>Done</button>
      </>
    );
  }
}