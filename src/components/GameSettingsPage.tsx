import { GameSetting } from './GameSetting';
import { IGameSettings, GameSettingKey } from '../interfaces';

interface GameSettingsPageProps
{
  gameSettings: IGameSettings;
  handleChangeGameSetting( settingName: GameSettingKey, newValue: number | string ): void;
  handleSettingsDoneClicked(): void;
}

export function GameSettingsPage( props: GameSettingsPageProps )
{
  let settings: any[] = [];

  for ( let settingKey in props.gameSettings )
  {
    if ( props.gameSettings.hasOwnProperty( settingKey ) )
    {
      const item = props.gameSettings[settingKey];
      settings.push(
        <GameSetting
          key={ item.settingKey }
          settingKey={ item.settingKey }
          settingTitle={ item.title }
          value={ item.value }
          options={ item.options }
          handleChangeGameSetting={ props.handleChangeGameSetting }
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
      <button onClick={ props.handleSettingsDoneClicked }>Done</button>
    </>
  );
}