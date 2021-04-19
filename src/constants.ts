export enum GameOverReason
{
    Undefined,
    BadBullshitCall,
    GoodBullshitCall,
    NoPossibleWords,
    FinishedWord
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