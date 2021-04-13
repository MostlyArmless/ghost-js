export type PlayerType = "AI" | "Human";

export interface IPlayer
{
    name: string;
    type: PlayerType;
}

export interface ISetting
{
    title: string;
    settingKey: GameSettingKey;
    value: any;
    options: any[];
}

export type GameSettingKey = 'minWordLength' | 'maxNumPlayers' | 'wordRecognitionMode' | 'wordListInGame';

export interface GameSettings
{
    [key: string]: ISetting
}

export type AppPage = 'Startup' | 'NewGame' | 'Play' | 'GameOver' | 'Help' | 'Settings' | 'PromptUserForWord';