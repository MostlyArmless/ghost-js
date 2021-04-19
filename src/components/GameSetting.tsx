import { GameSettingKey } from '../interfaces';

interface GameSettingProps
{
    settingKey: GameSettingKey;
    settingTitle: string;
    value: number | string;
    options: ( number | string )[];
    handleChangeGameSetting( settingName: GameSettingKey, newValue: number | string ): void;
}

export function GameSetting( props: GameSettingProps )
{
    const handleChangeGameSetting = ( event: any ) =>
    {
        props.handleChangeGameSetting( props.settingKey, event.target.value );
    }

    const options = props.options.map( option =>
    {
        return <option key={ option } value={ option }>{ option }</option>
    } );

    return (
        <tr>
            <td>{ props.settingTitle }</td>
            <td>
                <select
                    value={ props.value }
                    onChange={ handleChangeGameSetting }>
                    { options }
                </select>
            </td>
        </tr>
    );
}