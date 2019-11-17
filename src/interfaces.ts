export type PlayerType = "AI" | "Human";

export interface Player {
    name: string;
    type: PlayerType;
}

export interface GameSetting {
    title: string;
    value: any;
    options: any[];
}

export interface GameSettings {
    [key: string]: GameSetting
}