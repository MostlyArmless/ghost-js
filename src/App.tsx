import * as React from "react";
import { API } from "./API";
import "./App.css";
import { GameOver } from "./components/GameOver";
import { GameSettingsPage } from "./components/GameSettingsPage";
import { NewGame } from "./components/NewGame";
import { Play } from "./components/Play";
import { GameOverReason } from "./constants";
import { GameSettingKey, GameSettings, Player, PlayerType, AppPage } from "./interfaces";
import { getRandomLetter, getRandomElementFromArray } from "./tools";
import { HelpPage } from "./components/HelpPage";

interface AppProps { }

interface AppState
{
    currentPage: AppPage;
    previousPage: AppPage;
    invalidPlayerNames: boolean;
    players: Player[];
    gameSettings: GameSettings;
    nextChar: string;
    gameString: string;
    currentPlayerIndex: number;
    gameOverReason: GameOverReason;
    possibleWordList: string[];
    loser: Player;
    winner: Player;
    waitingForAiToChooseLetter: boolean;
}

const initialPlayers: Player[] = [
    { name: "Mike", type: "Human" },
    { name: "Borg", type: "AI" }
];

const initialState: AppState = {
    currentPage: "NewGame",
    previousPage: "NewGame",
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
            value: "auto",
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
    waitingForAiToChooseLetter: false
};

class App extends React.Component<AppProps, AppState> {
    API: API;

    constructor( props: AppProps )
    {
        super( props );
        this.state = initialState;
        this.API = new API();
    }

    getGameSettingValidOptions( settingKey: GameSettingKey ): any[]
    {
        return this.state.gameSettings[settingKey].options;
    }

    getGameSettingValue( settingKey: GameSettingKey ): number | string | boolean
    {
        return this.state.gameSettings[settingKey].value;
    }

    gameOver( updatedGameString: string, gameOverReason: GameOverReason, loser: Player )
    {
        console.log( `Game over because ${gameOverReason}...` );
        this.setState( {
            currentPage: "GameOver",
            gameString: updatedGameString,
            gameOverReason: gameOverReason,
            loser: loser
        } );
    }

    savePossibleWordListToState = ( possibleWordList: string[] ) =>
    {
        this.setState( { possibleWordList: possibleWordList } );
    }

    commitNextChar = async () =>
    {
        const updatedGameString = this.state.gameString + this.state.nextChar;

        // Ask the server for a list of all words that start with the current game string
        if ( this.gameStringAboveMinLength( updatedGameString ) )
        {
            const possibleWordList = await this.API.getPossibleWords( updatedGameString, this.savePossibleWordListToState );
            if ( possibleWordList.length === 1 && possibleWordList[0] === updatedGameString )
            {
                this.gameOver( updatedGameString, GameOverReason.finishedWord, this.getCurrentPlayer() );
                return;
            }
            else if ( possibleWordList.length === 0 )
            {
                if ( this.state.gameSettings.wordRecognitionMode.value == "auto" )
                {
                    this.gameOver( updatedGameString, GameOverReason.noPossibleWords, this.getCurrentPlayer() );
                    return;
                }
            }
        }

        this.nextTurn( updatedGameString );
    };

    aiPlaceLetterAndCommit = async () =>
    {
        this.setState( { waitingForAiToChooseLetter: true } );
        const nextChar = await this.aiGetNextChar();

        this.setState( { nextChar: nextChar, waitingForAiToChooseLetter: false }, this.commitNextChar );
    }

    takeAiTurnIfNeeded = () =>
    {
        if ( this.getCurrentPlayer().type === 'AI' )
        {
            this.aiPlaceLetterAndCommit();
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

    isNextPlayerAi = () =>
    {
        console.log( "is next player ai?" );
        return this.getNextPlayer().type === "AI";
    };

    resetGame = () =>
    {
        console.log( "Resetting game..." );
        this.setState( initialState );
    };

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

        this.setState( {
            invalidPlayerNames: false,
            currentPage: "Play"
        } );
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
        const numAiPlayers: number = this.state.players.map( ( player ): number => { return player.type == 'AI' ? 1 : 0 } ).reduce( ( acc, curr ) => { return acc + curr; } );

        if ( numAiPlayers === numPlayers - 1 && newType == 'AI' )
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
        if ( this.state.players.length == maxPlayers )
        {
            alert( `You can't have more than ${maxPlayers} players` );
            return;
        }

        this.setState( ( previousState: AppState ) =>
        {
            return {
                players: previousState.players.concat( {
                    name: "New Player",
                    type: "Human"
                } )
            };
        } );
    };

    handleRemovePlayer = ( index: number ) =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            const players = previousState.players;
            players.splice( index, 1 );
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
        try
        {
            const possibleWordList = await this.API.getPossibleWords( this.state.gameString, this.savePossibleWordListToState );
            if ( possibleWordList.length > 0 )
            {
                this.setState( {
                    currentPage: "GameOver",
                    gameOverReason: GameOverReason.badBullshitCall,
                    loser: this.getCurrentPlayer(),
                    winner: this.getPreviousPlayer(),
                    possibleWordList: possibleWordList
                } );
            }
            else
            {
                this.setState( {
                    currentPage: "GameOver",
                    gameOverReason: GameOverReason.goodBullshitCall,
                    loser: this.getPreviousPlayer(),
                    winner: this.getCurrentPlayer()
                } );
            }
        }
        catch ( error )
        {
            console.log( error );
        }
    };

    aiGetNextChar = async () =>
    {
        // AI will choose the next letter based on the current string
        console.log( `Taking AI turn, with current string = "${this.state.gameString}"...` );
        let nextLetter = "";

        let possibleWordList: string[] = [];
        if ( this.state.gameString.length > 0 )
        {
            possibleWordList = await this.API.getPossibleWords( this.state.gameString, this.savePossibleWordListToState );
        }

        if ( possibleWordList.length > 0 )
        {
            const targetWord = getRandomElementFromArray( possibleWordList ); // AI will choose a new target word every turn.
            nextLetter = targetWord[this.state.gameString.length];
            if ( nextLetter === undefined )
            {
                nextLetter = getRandomLetter();
                console.log( `AI failed to choose a valid letter when aiming for target word "${targetWord}". overriding with random letter '${nextLetter}'` );
            }
            else
            {
                console.log( `AI aiming for target word "${targetWord}". Submitting next letter '${nextLetter}'` );
            }
        }
        else
        {
            // AI realizes it can't do anything so it'll try to BS with a random letter
            nextLetter = getRandomLetter();
            console.log( `AI can't think of any words, bullshitting with letter '${nextLetter}'` );
        }

        return nextLetter;
    };

    private gameStringAboveMinLength( updatedGameString: string ): boolean
    {
        return updatedGameString.length > this.getGameSettingValue( 'minWordLength' );
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
            case "NewGame":
                page = (
                    <NewGame
                        playerList={ this.state.players }
                        handleRenamePlayer={ this.handleRenamePlayer }
                        handleChangePlayerType={ this.handleChangePlayerType }
                        handleRemovePlayer={ this.handleRemovePlayer }
                        handleStartClicked={ this.handleStartClicked }
                        invalidPlayerNames={ this.state.invalidPlayerNames }
                        handleAddPlayer={ this.handleAddPlayer }
                        reset={ this.resetGame }
                        handleSettingsClicked={ this.handleSettingsClicked }
                        getBlacklist={ this.API.getBlacklist }
                        getWhitelist={ this.API.getWhitelist }
                        handleHelp={ this.handleHelp }
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
                        displayWordList={ this.getGameSettingValue( "wordListInGame" ) as boolean }
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
                        handleNewGame={ this.resetGame }
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
