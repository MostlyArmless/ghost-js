import * as React from "react";
import { API } from "./API";
import "./App.css";
import { GameOver } from "./components/GameOver";
import { GameSettingsPage } from "./components/GameSettingsPage";
import { NewGame } from "./components/NewGame";
import { Play } from "./components/Play";
import { GameOverReason } from "./constants";
import { GameSettingKey, GameSettings, Player, PlayerType } from "./interfaces";
import { getRandomLetter, getRandomElementFromArray } from "./tools";

interface AppProps { }

interface AppState
{
    gameState: string;
    previousGameState: string;
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
}

const initialPlayers: Player[] = [
    { name: "Mike", type: "Human" },
    { name: "Borg", type: "AI" }
];

const initialState: AppState = {
    gameState: "newGame",
    previousGameState: "newGame",
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
            value: false,
            options: [true, false]
        }
    },
    nextChar: "",
    gameString: "",
    currentPlayerIndex: 0,
    gameOverReason: GameOverReason.undefined,
    possibleWordList: [],
    loser: initialPlayers[0],
    winner: initialPlayers[1]
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

    gameOver( updatedGameString: string, gameOverReason: GameOverReason )
    {
        console.log( `Game over because ${gameOverReason}...` );
        this.setState( {
            gameState: "gameOver",
            gameString: updatedGameString,
            gameOverReason: gameOverReason
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
            if ( possibleWordList.length === 1 )
            {
                this.gameOver( updatedGameString, GameOverReason.finishedWord );
                return;
            }
            else if ( possibleWordList.length === 0 )
            {
                if ( this.state.gameSettings.wordRecognitionMode.value == "auto" )
                {
                    this.gameOver( updatedGameString, GameOverReason.noPossibleWords );
                    return;
                }
            }
        }

        this.nextTurn( updatedGameString );
    };

    aiPlaceLetterAndCommit = async () =>
    {
        this.setState( { nextChar: await this.aiGetNextChar() } );
        this.commitNextChar();
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
        } );
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
            gameState: "playing"
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

    setGameSettings = ( settingName: GameSettingKey, value: number | string | boolean ) =>
    {
        if ( !this.getGameSettingValidOptions( settingName ).includes( value ) )
            return;

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
                previousGameState: previousState.gameState,
                gameState: "settings"
            };
        } );
    };

    handleSettingsDoneClicked = () =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            return {
                gameState: previousState.previousGameState,
                previousGameState: "settings"
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
                    gameState: "gameOver",
                    gameOverReason: GameOverReason.badBullshitCall,
                    loser: this.getCurrentPlayer(),
                    winner: this.getPreviousPlayer(),
                    possibleWordList: possibleWordList
                } );
            }
            else
            {
                this.setState( {
                    gameState: "gameOver",
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

        const possibleWordList = await this.API.getPossibleWords( this.state.gameString, this.savePossibleWordListToState );

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

    render()
    {
        let page = <h1>Ghost Game</h1>;

        switch ( this.state.gameState )
        {
            case "newGame":
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
                    />
                );
                break;
            case "playing":
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
                        aiPlaceLetterAndCommit={ this.aiPlaceLetterAndCommit }
                        handleExitGame={ this.resetGame }
                        displayWordList={ this.getGameSettingValue( "wordListInGame" ) as boolean }
                    />
                );
                break;
            case "gameOver":
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
            case "settings":
                page = (
                    <GameSettingsPage
                        gameSettings={ this.state.gameSettings }
                        handleChangeGameSetting={ this.setGameSettings }
                        handleSettingsDoneClicked={ this.handleSettingsDoneClicked }
                    />
                );
                break;
            default:
                page = <p>Invalid gameState.</p>;
        }

        return <div className="App">{ page }</div>;
    }
}

export default App;
