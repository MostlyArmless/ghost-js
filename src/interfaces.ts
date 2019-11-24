export type PlayerType = "AI" | "Human";

export interface Player
{
    name: string;
    type: PlayerType;
}

export interface SettingStruct
{
    title: string;
    settingKey: GameSettingKey;
    value: any;
    options: any[];
}

export type GameSettingKey = 'minWordLength' | 'maxNumPlayers' | 'wordRecognitionMode' | 'wordListInGame';

export interface GameSettings
{
    [key: string]: SettingStruct
}

export type AppPage = 'NewGame' | 'Play' | 'GameOver' | 'Help' | 'Settings';