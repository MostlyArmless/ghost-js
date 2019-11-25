import React from 'react';
import { GameSettingKey } from '../interfaces';

interface GameSettingProps
{
    settingKey: GameSettingKey;
    settingTitle: string;
    value: number | string;
    options: ( number | string )[];
    handleChangeGameSetting( settingName: GameSettingKey, newValue: number | string ): void;
}

interface GameSettingState
{

}

export class GameSetting extends React.Component<GameSettingProps, GameSettingState> {

    handleChangeGameSetting = ( event: any ) =>
    {
        this.props.handleChangeGameSetting( this.props.settingKey, event.target.value );
    }

    render()
    {
        const options = this.props.options.map( option =>
        {
            return <option key={ option } value={ option }>{ option }</option>
        } );

        return (
            <tr>
                <td>{ this.props.settingTitle }</td>
                <td>
                    <select
                        value={ this.props.value }
                        onChange={ this.handleChangeGameSetting }>
                        { options }
                    </select>
                </td>
            </tr>
        );
    }
}