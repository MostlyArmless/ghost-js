import * as React from "react";
import { API } from "./API";
import "./App.css";
import { GameOver } from "./components/GameOver";
import { GameSettingsPage } from "./components/GameSettingsPage";
import { NewGame } from "./components/NewGame";
import { Play } from "./components/Play";
import { eGameActions, GameOverReason } from "./constants";
import { GameSettingKey, IGameSettings, IPlayer, PlayerType, AppPage, DifficultyLevel, AppendOrPrependMode } from "./interfaces";
import { HelpPage } from "./components/HelpPage";
import { PromptUserForWord } from "./components/PromptUserForWord";
import { Startup } from "./components/Startup";
import { RoboPlayer } from "./RoboPlayer";
import { convertEnumValToString } from "./tools";

const wordServerApi = new API();

interface AppProps { }

interface AppState
{
    currentPage: AppPage;
    previousPage: AppPage;
    invalidPlayerNames: boolean;
    players: IPlayer[];
    gameSettings: IGameSettings;
    nextChar: string;
    gameString: string;
    currentPlayerIndex: number;
    gameOverReason: GameOverReason;
    possibleWordList: string[];
    loser: IPlayer;
    winner: IPlayer;
    waitingForAiToChooseLetter: boolean;
    rebuttalWord: string;
    whitelistedWords: string[];
    blacklistedWords: string[];
    getPossibleWords: ( gameString: string ) => Promise<string[]>;
    countPossibleWords: ( gameString: string ) => Promise<number>;
}

const initialPlayers: IPlayer[] = [
    { name: "Mike", type: "Human", aiDifficulty: "N/A" },
    { name: "Borg", type: "AI", aiDifficulty: "Hard" }
];

const initialState: AppState = {
    currentPage: "Startup",
    previousPage: "Startup",
    invalidPlayerNames: false,
    players: initialPlayers,
    gameSettings: {
        minWordLength: {
            settingKey: "minWordLength",
            title: "Minimum Word Length",
            value: 4,
            options: [3, 4, 5, 6]
        },
        maxNumPlayers: {
            settingKey: "maxNumPlayers",
            title: "Maximum Number of Players",
            value: 4,
            options: [3, 4, 5]
        },
        wordRecognitionMode: {
            settingKey: "wordRecognitionMode",
            title: "Word Recognition Mode",
            value: "manual",
            options: ["auto", "manual"]
        },
        wordListInGame: {
            settingKey: 'wordListInGame',
            title: "Show list of possible words in game",
            value: 'Hide',
            options: ['Show', 'Hide']
        },
        appendOrPrependMode: {
            settingKey: 'appendOrPrependMode',
            title: 'Rules for choosing next letter',
            value: 'Append Only',
            options: ['Append Only', 'Prepend Only'] // TODO - add "Append and Prepend" to this list when it is supported
        }
    },
    nextChar: "",
    gameString: "",
    currentPlayerIndex: 0,
    gameOverReason: GameOverReason.Undefined,
    possibleWordList: [],
    loser: initialPlayers[0],
    winner: initialPlayers[1],
    waitingForAiToChooseLetter: false,
    rebuttalWord: '',
    whitelistedWords: [],
    blacklistedWords: [],
    getPossibleWords: wordServerApi.getAllWordsStartingWith,
    countPossibleWords: wordServerApi.countWordsStartingWith,
};

const newGameState: Partial<AppState> = {
    currentPage: "NewGame",
    previousPage: "Startup",
    nextChar: initialState.nextChar,
    gameString: initialState.gameString,
    currentPlayerIndex: initialState.currentPlayerIndex,
    gameOverReason: initialState.gameOverReason,
    loser: initialState.loser,
    winner: initialState.winner,
    waitingForAiToChooseLetter: initialState.waitingForAiToChooseLetter,
    rebuttalWord: initialState.rebuttalWord,
}

class App extends React.Component<AppProps, AppState> {
    roboPlayer: RoboPlayer;

    constructor( props: AppProps )
    {
        super( props );
        this.state = initialState;
        this.roboPlayer = new RoboPlayer( wordServerApi, "Hard", 2 );
    }

    getGameSettingValidOptions( settingKey: GameSettingKey ): any[]
    {
        return this.state.gameSettings[settingKey].options;
    }

    getGameSettingValue( settingKey: GameSettingKey ): number | string | boolean
    {
        return this.state.gameSettings[settingKey].value;
    }

    async gameOver( updatedGameString: string, gameOverReason: GameOverReason, loser: IPlayer, winner?: IPlayer ): Promise<void>
    {
        console.log( `Game over because ${convertEnumValToString( GameOverReason, gameOverReason )}...` );
        const possibleWords = await this.state.getPossibleWords( this.state.gameString );

        this.setState( prev =>
        {
            return {
                currentPage: "GameOver",
                gameString: updatedGameString,
                gameOverReason: gameOverReason,
                winner: winner ?? prev.winner,
                loser: loser,
                possibleWordList: possibleWords
            };
        } );
    }

    savePossibleWordListToState = ( possibleWordList: string[] ) =>
    {
        this.setState( { possibleWordList: possibleWordList } );
    }

    commitPrependChar = async (): Promise<void> =>
    {
        console.log( `Player ${this.getCurrentPlayer().name} prepended "${this.state.nextChar}"` );
        const updatedGameString = this.state.nextChar + this.state.gameString;
        this.commitNextChar( updatedGameString );
    }

    commitAppendChar = async (): Promise<void> =>
    {
        console.log( `Player ${this.getCurrentPlayer().name} appended "${this.state.nextChar}"` );
        const updatedGameString = this.state.gameString + this.state.nextChar;
        this.commitNextChar( updatedGameString );
    }

    // Don't call this directly, only call it via commitPrependChar or commitAppendChar
    commitNextChar = async ( updatedGameString: string ): Promise<void> =>
    {
        if ( this.gameStringIsLongEnough( updatedGameString ) )
        {
            if ( await wordServerApi.isWord( updatedGameString ) )
            {
                this.gameOver( updatedGameString, GameOverReason.FinishedWord, this.getCurrentPlayer() );
                return;
            }
            else if ( this.state.gameSettings.wordRecognitionMode.value === "auto" && await this.state.countPossibleWords( updatedGameString ) === 0 )
            {
                this.gameOver( updatedGameString, GameOverReason.NoPossibleWords, this.getCurrentPlayer() );
                return;
            }
        }

        this.nextTurn( updatedGameString );
    };

    takeAiTurnIfNeeded = async () =>
    {
        if ( this.getCurrentPlayer().type !== 'AI' )
            return;

        this.setState( { waitingForAiToChooseLetter: true } );
        const robotNextMove = await this.roboPlayer.decideNextMove( this.state.gameString, this.getGameSettingValue( "appendOrPrependMode" ) as AppendOrPrependMode );
        switch ( robotNextMove )
        {
            case eGameActions.CallBullshit:
                {
                    await this.handleCallBullshit();
                    return;
                }
            case eGameActions.AppendLetter:
                {
                    const nextChar = await this.roboPlayer.chooseLetterToAppend( this.state.gameString );
                    this.setState( { nextChar: nextChar, waitingForAiToChooseLetter: false }, this.commitAppendChar );
                    return
                }
            case eGameActions.PrependLetter:
                {
                    const nextChar = await this.roboPlayer.chooseLetterToPrepend( this.state.gameString );
                    this.setState( { nextChar: nextChar, waitingForAiToChooseLetter: false }, this.commitPrependChar );
                    return
                }
            default:
                {
                    throw new Error( `Invalid game action selected by AI: "${robotNextMove}"` );
                }
        }
    }

    nextTurn = ( updatedGameString: string ) =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            const numPlayers = this.state.players.length;
            return {
                currentPlayerIndex: ( previousState.currentPlayerIndex + 1 ) % numPlayers,
                nextChar: '',
                gameString: updatedGameString
            };
        }, this.takeAiTurnIfNeeded );
    };

    getCurrentPlayer = () =>
    {
        return this.state.players[this.state.currentPlayerIndex];
    };

    getPreviousPlayer = () =>
    {
        const previousPlayerIndex =
            this.state.currentPlayerIndex === 0
                ? this.state.players.length - 1
                : this.state.currentPlayerIndex - 1;
        return this.state.players[previousPlayerIndex];
    };

    getNextPlayer = () =>
    {
        console.log( "Get next player..." );
        const nextPlayerIndex =
            ( this.state.currentPlayerIndex + 1 ) % this.state.players.length;
        return this.state.players[nextPlayerIndex];
    };

    resetGame = () =>
    {
        console.log( "Resetting game..." );
        this.setState( initialState );
    };

    handleNewGame = () =>
    {
        console.log( `Returning to NewGame screen` );
        this.setState( ( prevState ) =>
        {
            return {
                ...prevState,
                ...newGameState
            };
        } );
    }

    handleNextCharChange = ( event: any ) =>
    {
        this.setState( {
            nextChar: event.target.value
        } );
    };

    handleStartClicked = () =>
    {
        const names = this.state.players.map( player => player.name );
        const anyBlankNames = names.filter( name => name.length === 0 ).length > 0;
        const allNamesUnique = ( new Set( names ) ).size === names.length;

        if ( !allNamesUnique || anyBlankNames )
        {
            this.setState( { invalidPlayerNames: true } );
            return;
        }

        this.roboPlayer.reset();

        this.setState( {
            invalidPlayerNames: false,
            currentPage: "Play"
        }, this.takeAiTurnIfNeeded );
    };

    handleRenamePlayer = ( index: number, newName: string ) =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            const newPlayerList = previousState.players;
            newPlayerList[index].name = newName;
            return {
                players: newPlayerList
            };
        } );
    };

    handleChangePlayerType = ( index: number, newType: PlayerType ) =>
    {
        const numPlayers: number = this.state.players.length;
        const numAiPlayers: number = this.state.players.map( ( player ): number => { return player.type === 'AI' ? 1 : 0 } ).reduce( ( acc, curr ) => { return acc + curr; } );

        // TODO - fix the problems that arise in a multi-AI game, then remove this block:
        if ( numAiPlayers === 1 && newType === 'AI' )
        {
            alert( 'ghost-js currently only supports up to 1 AI player. Multi-AI play coming soon.' );
            return;
        }

        if ( numAiPlayers === numPlayers - 1 && newType === 'AI' )
        {
            alert( 'Must have at least 1 Human player' );
            return;
        }

        this.setState( ( previousState: AppState ) =>
        {
            const players = previousState.players;
            players[index].type = newType;
            return {
                players: players
            };
        } );
    };

    handleChangeRoboDifficulty = ( difficulty: DifficultyLevel ) =>
    {
        this.roboPlayer.setDifficultyLevel( difficulty );
        this.setState( prevState =>
        {
            const updatedPlayers = prevState.players;
            updatedPlayers[1].aiDifficulty = difficulty; // TODO this assumes the AI player is always in the same slot
            return { players: updatedPlayers }
        } );
    }

    setGameSetting = ( settingName: GameSettingKey, value: number | string | boolean ) =>
    {
        const validSettings = this.getGameSettingValidOptions( settingName );
        console.log( typeof ( value ) );
        console.log( typeof ( validSettings[0] ) );

        switch ( typeof ( validSettings[0] ) )
        {
            case "number":
                value = parseInt( value as string );
                break;
            case "string":
                value = value.toString();
                break;
            default:
                console.error( "INVALID INPUT TYPE" );
        }

        if ( !validSettings.includes( value ) )
        {
            console.warn( `Attempted to set setting "${settingName}" to invalid value "${value}". Valid settings would have been: ${validSettings}` )
            return;
        }

        this.setState( ( previousState: AppState ) =>
        {
            // TODO - extract this logic to a function
            let updatedGetPossibleWords: ( gameString: string ) => Promise<string[]> = wordServerApi.getAllWordsStartingWith;
            let updatedCountPossibleWords: ( gameString: string ) => Promise<number> = wordServerApi.countWordsStartingWith;

            if ( settingName === "appendOrPrependMode" )
            {
                // Need to update the wordServer API lambdas stored in App.state
                switch ( value as AppendOrPrependMode )
                {
                    case "Append Only":
                        break; // Initialized to these values already
                    case "Prepend Only":
                        updatedGetPossibleWords = wordServerApi.getAllWordsEndingWith;
                        updatedCountPossibleWords = wordServerApi.countWordsEndingWith;
                        break;
                    case "Append or Prepend":
                        updatedGetPossibleWords = wordServerApi.getAllWordsContaining;
                        updatedCountPossibleWords = wordServerApi.countWordsContaining;
                        break;
                    default:
                        throw new Error( "Unhandled option" );
                }
            }

            let newSettings = previousState.gameSettings;
            newSettings[settingName].value = value;
            console.log( newSettings );
            return {
                gameSettings: newSettings,
                getPossibleWords: settingName === "appendOrPrependMode" ? updatedGetPossibleWords : previousState.getPossibleWords,
                countPossibleWords: settingName === "appendOrPrependMode" ? updatedCountPossibleWords : previousState.countPossibleWords,
            };
        } );
    };

    handleAddPlayer = () =>
    {
        const maxPlayers = this.getGameSettingValue( 'maxNumPlayers' );
        if ( this.state.players.length === maxPlayers )
        {
            alert( `You can't have more than ${maxPlayers} players` );
            return;
        }

        this.setState( ( previousState: AppState ) =>
        {
            const newNumPlayers = previousState.players.length + 1;
            this.roboPlayer.setNumPlayers( newNumPlayers );

            return {
                players: [...previousState.players,
                {
                    name: "New Player",
                    type: "Human",
                    aiDifficulty: "N/A"
                }]
            };
        } );
    };

    handleRemovePlayer = ( index: number ) =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            const players = previousState.players;
            players.splice( index, 1 );
            const newNumPlayers = players.length;
            this.roboPlayer.setNumPlayers( newNumPlayers );
            return {
                players: players
            };
        } );
    };

    handleSettingsClicked = () =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            return {
                previousPage: previousState.currentPage,
                currentPage: "Settings"
            };
        } );
    };

    handleSettingsDoneClicked = () =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            return {
                currentPage: previousState.previousPage,
                previousPage: "Settings"
            };
        } );
    };

    handleCallBullshit = async () =>
    {
        const mode = this.getGameSettingValue( "wordRecognitionMode" );
        console.log( `handleCallBullshit` );
        if ( mode === "auto" || this.getPreviousPlayer().type === 'AI' )
        {
            await this.resolveBullshitCallAutomatically();
            return;
        }

        if ( mode === 'manual' )
        {
            this.resolveBullshitCallOnHuman();
            return;
        }

        console.error( `Invalid wordRecognitionMode` );
    };

    resolveBullshitCallOnHuman = () =>
    {
        // Current player called bullshit on the previous player. Give the previous player a chance to supply a valid word
        this.setState( { currentPage: "PromptUserForWord" } );
    }

    handleSubmitBullshitRebuttal = async ( rebuttalWord: string ) =>
    {
        this.setState( { rebuttalWord: rebuttalWord }, async () =>
        {
            const minWordLength = this.getGameSettingValue( "minWordLength" ) as number;
            if ( rebuttalWord.length >= minWordLength && await wordServerApi.isWord( rebuttalWord ) )
            {
                // The word is in the dictionary, so the BS-caller loses
                this.gameOver( this.state.gameString, GameOverReason.BadBullshitCall, this.getCurrentPlayer(), this.getPreviousPlayer() );
            }
            else
            {
                // The word is NOT in the dictionary, so the BS-callee loses
                // TODO - make it possible for the BS-caller to accept the word anyways (because they know it's really a word), and add it to the dictionary.
                this.gameOver( this.state.gameString, GameOverReason.GoodBullshitCall, this.getPreviousPlayer(), this.getCurrentPlayer() );
            }
        } );
    }

    resolveBullshitCallAutomatically = async () =>
    {
        try
        {
            const possibleWordList = await this.state.getPossibleWords( this.state.gameString );
            if ( possibleWordList.length > 0 )
            {
                this.gameOver(
                    this.state.gameString,
                    GameOverReason.BadBullshitCall,
                    this.getCurrentPlayer(),
                    this.getPreviousPlayer()
                );
            }
            else
            {
                this.gameOver(
                    this.state.gameString,
                    GameOverReason.GoodBullshitCall,
                    this.getPreviousPlayer(),
                    this.getCurrentPlayer()
                );
            }
        }
        catch ( error )
        {
            console.log( error );
        }
    }

    refreshWhitelist = async () =>
    {
        const updatedWhitelist = await wordServerApi.getWhitelist();
        this.setState( { whitelistedWords: updatedWhitelist } );
    }

    refreshBlacklist = async () =>
    {
        const updatedBlacklist = await wordServerApi.getBlacklist();
        this.setState( { blacklistedWords: updatedBlacklist } );
    }

    private gameStringIsLongEnough( updatedGameString: string ): boolean
    {
        return updatedGameString.length >= this.getGameSettingValue( 'minWordLength' );
    }

    handleHelp = () =>
    {
        this.setState( { currentPage: 'Help' } );
    }

    handleBack = () =>
    {
        this.setState( previousState =>
        {
            return {
                currentPage: previousState.previousPage,
                previousPage: "NewGame" // TODO - implement a stack so we can have indefinite Back depth
            };
        } )
    }

    render()
    {
        let page = <h1>Ghost Game</h1>;

        switch ( this.state.currentPage )
        {
            case "Startup":
                page = (
                    <Startup
                        waitForServerToComeOnline={ wordServerApi.pingServer }
                        handleNewGame={ this.handleNewGame }
                    />
                );
                break;

            case "NewGame":
                page = (
                    <NewGame
                        playerList={ this.state.players }
                        handleRenamePlayer={ this.handleRenamePlayer }
                        handleChangePlayerType={ this.handleChangePlayerType }
                        handleChangeRoboDifficulty={ this.handleChangeRoboDifficulty }
                        handleRemovePlayer={ this.handleRemovePlayer }
                        handleStartClicked={ this.handleStartClicked }
                        isAnyPlayerNameInvalid={ this.state.invalidPlayerNames }
                        handleAddPlayer={ this.handleAddPlayer }
                        reset={ this.resetGame }
                        handleSettingsClicked={ this.handleSettingsClicked }
                        blacklistedWords={ this.state.blacklistedWords }
                        whitelistedWords={ this.state.whitelistedWords }
                        handleHelp={ this.handleHelp }
                        clearBlacklist={ async () => { wordServerApi.clearBlacklist(); this.setState( { blacklistedWords: [] } ); } }
                        clearWhitelist={ async () => { wordServerApi.clearWhitelist(); this.setState( { whitelistedWords: [] } ); } }
                        refreshBlacklist={ this.refreshBlacklist }
                        refreshWhitelist={ this.refreshWhitelist }
                    />
                );
                break;

            case "Play":
                page = (
                    <Play
                        handleNextCharChange={ this.handleNextCharChange }
                        nextChar={ this.state.nextChar }
                        gameString={ this.state.gameString }
                        getCurrentPlayer={ this.getCurrentPlayer }
                        getPreviousPlayer={ this.getPreviousPlayer }
                        commitAppendChar={ this.commitAppendChar }
                        commitPrependChar={ this.commitPrependChar }
                        possibleWordList={ this.state.possibleWordList }
                        handleCallBullshit={ this.handleCallBullshit }
                        handleExitGame={ this.resetGame }
                        displayWordList={ this.getGameSettingValue( "wordListInGame" ) === "Show" }
                        waitingForAiToChooseLetter={ this.state.waitingForAiToChooseLetter }
                        appendOrPrependMode={ this.getGameSettingValue( "appendOrPrependMode" ) as AppendOrPrependMode }
                    />
                );
                break;

            case "GameOver":
                page = (
                    <GameOver
                        losingPlayer={ this.state.loser }
                        winningPlayer={ this.state.winner }
                        gameString={ this.state.gameString }
                        gameOverReason={ this.state.gameOverReason }
                        rebuttalWord={ this.state.rebuttalWord }
                        appendOrPrependMode={ this.getGameSettingValue( "appendOrPrependMode" ) as AppendOrPrependMode }
                        handleNewGame={ this.handleNewGame }
                        possibleWordList={ this.state.possibleWordList }
                        addToBlacklist={ wordServerApi.blacklistWord }
                        addToWhitelist={ wordServerApi.whitelistWord }
                        isWordInDictionary={ wordServerApi.isWord }
                    />
                );
                break;

            case "Settings":
                page = (
                    <GameSettingsPage
                        gameSettings={ this.state.gameSettings }
                        handleChangeGameSetting={ this.setGameSetting }
                        handleSettingsDoneClicked={ this.handleSettingsDoneClicked }
                    />
                );
                break;

            case "Help":
                page = ( <HelpPage
                    handleBack={ this.handleBack }
                /> );
                break;

            case "PromptUserForWord":
                page = (
                    <PromptUserForWord
                        gameString={ this.state.gameString }
                        currentPlayer={ this.getCurrentPlayer() }
                        previousPlayer={ this.getPreviousPlayer() }
                        handleSubmitWord={ this.handleSubmitBullshitRebuttal }
                    />
                )
                break;

            default:
                page = <p>Invalid gameState.</p>;
        }

        return (
            <div className="App">
                <h1>👻</h1>
                { page }
            </div>
        );
    }
}

export default App;
