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

export enum eGameActions
{
    AppendLetter,
    PrependLetter,
    CallBullshit
}

export const ENTER_KEY_CODE = 13;