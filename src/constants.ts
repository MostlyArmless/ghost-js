// TODO - replace union type with enum
export enum GameOverReason
{
    undefined,
    badBullshitCall,
    goodBullshitCall,
    noPossibleWords,
    finishedWord
}

export enum WordRecognitionMode
{
    AutoCallBullshit,
    ManualCallBullshit
}