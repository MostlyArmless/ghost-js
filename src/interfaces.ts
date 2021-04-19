export type PlayerType = "AI" | "Human";

export type DifficultyLevel = "N/A" | "Easy" | "Hard";

export interface IPlayer
{
    name: string;
    type: PlayerType;
    aiDifficulty: DifficultyLevel
}

export interface ISetting
{
    title: string;
    settingKey: GameSettingKey;
    value: any;
    options: any[];
}

export type GameSettingKey = 'minWordLength' | 'maxNumPlayers' | 'wordRecognitionMode' | 'wordListInGame' | 'appendOrPrependMode';

export interface IGameSettings
{
    [key: string]: ISetting
}

export type AppPage = 'Startup' | 'NewGame' | 'Play' | 'GameOver' | 'Help' | 'Settings' | 'PromptUserForWord';

export type AppendOrPrependMode = 'Append Only' | 'Prepend Only' | 'Append or Prepend';

export interface ILetterChoosingStrategy
{
    getPossibleWords: ( gameString: string ) => Promise<string[]>;
    chooseNextLetter: ( targetWord: string, gameString: string ) => string;
}