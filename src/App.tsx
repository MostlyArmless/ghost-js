import * as React from "react";
import { API } from "./API";
import "./App.css";
import { GameOver } from "./components/GameOver";
import { GameSettingsPage } from "./components/GameSettingsPage";
import { NewGame } from "./components/NewGame";
import { Play } from "./components/Play";
import { eGameActions, GameOverReason } from "./constants";
import { GameSettingKey, GameSettings, IPlayer, PlayerType, AppPage, DifficultyLevel } from "./interfaces";
import { HelpPage } from "./components/HelpPage";
import { PromptUserForWord } from "./components/PromptUserForWord";
import { Startup } from "./components/Startup";
import { RoboPlayer } from "./RoboPlayer";

interface AppProps { }

interface AppState
{
    currentPage: AppPage;
    previousPage: AppPage;
    invalidPlayerNames: boolean;
    players: IPlayer[];
    gameSettings: GameSettings;
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
}

const initialPlayers: IPlayer[] = [
    { name: "Mike", type: "Human", aiDifficulty: "N/A" },
    { name: "Borg", type: "AI", aiDifficulty: "Easy" }
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
        }
    },
    nextChar: "",
    gameString: "",
    currentPlayerIndex: 0,
    gameOverReason: GameOverReason.undefined,
    possibleWordList: [],
    loser: initialPlayers[0],
    winner: initialPlayers[1],
    waitingForAiToChooseLetter: false,
    rebuttalWord: '',
    whitelistedWords: [],
    blacklistedWords: []
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
    API: API;
    roboPlayer: RoboPlayer;

    constructor( props: AppProps )
    {
        super( props );
        this.state = initialState;
        this.API = new API();
        this.roboPlayer = new RoboPlayer( this.API, "Hard", 2 ); // TODO default this to Easy instead
    }

    getGameSettingValidOptions( settingKey: GameSettingKey ): any[]
    {
        return this.state.gameSettings[settingKey].options;
    }

    getGameSettingValue( settingKey: GameSettingKey ): number | string | boolean
    {
        return this.state.gameSettings[settingKey].value;
    }

    gameOver( updatedGameString: string, gameOverReason: GameOverReason, loser: IPlayer, winner?: IPlayer )
    {
        console.log( `Game over because ${gameOverReason}...` );
        this.setState( {
            currentPage: "GameOver",
            gameString: updatedGameString,
            gameOverReason: gameOverReason,
            loser: loser
        } );

        if ( winner )
        {
            this.setState( { winner: winner } );
        }
    }

    savePossibleWordListToState = ( possibleWordList: string[] ) =>
    {
        this.setState( { possibleWordList: possibleWordList } );
    }

    commitNextChar = async () =>
    {
        const updatedGameString = this.state.gameString + this.state.nextChar;

        // Ask the server for a list of all words that start with the current game string
        if ( this.gameStringIsLongEnough( updatedGameString ) )
        {
            const possibleWordList = await this.API.getPossibleWords( updatedGameString, this.savePossibleWordListToState );
            if ( possibleWordList.includes( updatedGameString ) )
            {
                this.gameOver( updatedGameString, GameOverReason.finishedWord, this.getCurrentPlayer() );
                return;
            }
            else if ( possibleWordList.length === 0 )
            {
                if ( this.state.gameSettings.wordRecognitionMode.value === "auto" )
                {
                    this.gameOver( updatedGameString, GameOverReason.noPossibleWords, this.getCurrentPlayer() );
                    return;
                }
            }
        }

        this.nextTurn( updatedGameString );
    };

    takeAiTurnIfNeeded = async () =>
    {
        if ( this.getCurrentPlayer().type !== 'AI' )
            return;

        this.setState( { waitingForAiToChooseLetter: true } );
        const robotNextMove = await this.roboPlayer.decideNextMove( this.state.gameString );
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
                    this.setState( { nextChar: nextChar, waitingForAiToChooseLetter: false }, this.commitNextChar );
                    return
                }
            case eGameActions.PrependLetter:
                {
                    // const nextChar = await this.roboPlayer.chooseLetterToPrepend( this.state.gameString );
                    // TODO - implement prependLetter
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
        let names = new Set();
        for ( let i = 0; i < this.state.players.length; i++ )
        {
            const name = this.state.players[i].name;
            if ( name.length === 0 || names.has( name ) )
            {
                this.setState( {
                    invalidPlayerNames: true
                } );
                return;
            }
            names.add( name );
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
            let newSettings = previousState.gameSettings;
            newSettings[settingName].value = value;
            console.log( newSettings );
            return {
                gameSettings: newSettings
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
        console.log( `handlCallBullshit` );
        if ( mode === "auto" || this.getPreviousPlayer().type === 'AI' )
        {
            await this.resolveBullshitCallOnRobot();
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
        await this.API.getPossibleWords( rebuttalWord, this.savePossibleWordListToState );

        this.setState( { rebuttalWord: rebuttalWord }, async () =>
        {
            const minWordLength = this.getGameSettingValue( "minWordLength" ) as number;
            if ( rebuttalWord.length >= minWordLength && await this.API.checkForWord( rebuttalWord ) )
            {
                // The word is in the dictionary, so the BS-caller loses
                this.gameOver( this.state.gameString, GameOverReason.badBullshitCall, this.getCurrentPlayer(), this.getPreviousPlayer() );
            }
            else
            {
                // The word is NOT in the dictionary, so the BS-callee loses
                // TODO - make it possible for the BS-caller to accept the word anyways (because they know it's really a word), and add it to the dictionary.
                this.gameOver( this.state.gameString, GameOverReason.goodBullshitCall, this.getPreviousPlayer(), this.getCurrentPlayer() );
            }
        } );
    }

    resolveBullshitCallOnRobot = async () =>
    {
        try
        {
            const possibleWordList = await this.API.getPossibleWords( this.state.gameString, this.savePossibleWordListToState );
            if ( possibleWordList.length > 0 )
            {
                this.gameOver(
                    this.state.gameString,
                    GameOverReason.badBullshitCall,
                    this.getCurrentPlayer(),
                    this.getPreviousPlayer()
                );
            }
            else
            {
                this.gameOver(
                    this.state.gameString,
                    GameOverReason.goodBullshitCall,
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
        const updatedWhitelist = await this.API.getWhitelist();
        this.setState( { whitelistedWords: updatedWhitelist } );
    }

    refreshBlacklist = async () =>
    {
        const updatedBlacklist = await this.API.getBlacklist();
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
                        waitForServerToComeOnline={ this.API.pingServer }
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
                        clearBlacklist={ async () => { this.API.clearBlacklist(); this.setState( { blacklistedWords: [] } ); } }
                        clearWhitelist={ async () => { this.API.clearWhitelist(); this.setState( { whitelistedWords: [] } ); } }
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
                        commitNextChar={ this.commitNextChar }
                        possibleWordList={ this.state.possibleWordList }
                        handleCallBullshit={ this.handleCallBullshit }
                        handleExitGame={ this.resetGame }
                        displayWordList={ this.getGameSettingValue( "wordListInGame" ) === "Show" }
                        waitingForAiToChooseLetter={ this.state.waitingForAiToChooseLetter }
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
                        handleNewGame={ this.handleNewGame }
                        possibleWordList={ this.state.possibleWordList }
                        addToBlacklist={ this.API.blacklistWord }
                        addToWhitelist={ this.API.whitelistWord }
                        isWordInDictionary={ this.API.checkForWord }
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
