import { GameOverReason } from '../constants';
import { AppendOrPrependMode, IPlayer } from '../interfaces';
import { Button } from './Button';
import { RemovableWord } from './RemovableWord';
import { TextboxAndButton } from './TextboxAndButton';

interface GameOverProps
{
    gameOverReason: GameOverReason;
    losingPlayer: IPlayer;
    winningPlayer: IPlayer;
    gameString: string;
    possibleWordList: string[];
    rebuttalWord?: string;
    appendOrPrependMode: AppendOrPrependMode;

    handleNewGame(): void;
    addToBlacklist( word: string ): void;
    addToWhitelist( word: string ): void;
    isWordInDictionary( testWord: string ): Promise<boolean>;
}

export function GameOver( props: GameOverProps )
{
    const addToBlacklist = () =>
    {
        props.addToBlacklist( props.gameString );
        alert( `Added "${props.gameString}" to the blacklist.` );
    }

    const submitWordToWhitelist = async ( word: string ) =>
    {
        if ( word.length === 0 )
        {
            alert( "Can't add blank word to dictionary" );
            return;
        }
        if ( await props.isWordInDictionary( word ) )
        {
            alert( "This word is already in the dictionary!" );
            return;
        }

        props.addToWhitelist( word );
        alert( `Added "${word}" to dictionary for future games` );
    }

    const buildLoserReason = () =>
    {
        switch ( props.gameOverReason )
        {
            case GameOverReason.FinishedWord:
                return <p>{ props.losingPlayer.name } lost by spelling the word: "{ props.gameString }"</p>;

            case GameOverReason.NoPossibleWords:
                return <p>{ props.losingPlayer.name } lost because no word starts with "{ props.gameString }"</p>;

            case GameOverReason.GoodBullshitCall:
                return (
                    <>
                        <p>{ props.losingPlayer.name } lost because { props.winningPlayer.name } correctly called bullshit on them.<br />There are no words that start with "{ props.gameString }"</p>
                        {props.rebuttalWord && <p>"{ props.rebuttalWord }" is NOT a valid word.</p> }
                    </>
                );

            case GameOverReason.BadBullshitCall:
                return (
                    <>
                        <p>{ props.losingPlayer.name } lost because they incorrectly called bullshit on { props.winningPlayer.name }.</p>
                        <br />
                        { props.rebuttalWord && <p>{ props.winningPlayer.name } won because they successfully rebutted with the word "{ props.rebuttalWord }"</p> }
                        <p>Here are some words that { props.appendOrPrependMode === "Append Only" ? "start with" : props.appendOrPrependMode === "Prepend Only" ? "end with" : "contain" } "{ props.gameString }":</p>
                        <ol>
                            { props.possibleWordList.map( word =>
                            {
                                return ( <li key={ word }>
                                    <RemovableWord
                                        word={ word }
                                        handleRemoveWord={ props.addToBlacklist }
                                    />
                                </li> );
                            } ) }
                        </ol>
                    </>
                );

            default:
                console.log( props );
                return <p>Game ended for unknown reason</p>;
        }
    }

    return (
        <div className='App'>
            <h1>GAME OVER</h1>
            <Button
                text='New Game'
                onClick={ props.handleNewGame }
            />
            { buildLoserReason() }
            { props.gameOverReason === GameOverReason.FinishedWord &&
                <Button
                    text='Blacklist Word'
                    onClick={ addToBlacklist }
                />
            }
            { props.gameOverReason === GameOverReason.GoodBullshitCall &&
                <TextboxAndButton
                    onSubmit={ submitWordToWhitelist }
                    buttonText="Add to Dictionary"
                />
            }
        </div>
    );
}