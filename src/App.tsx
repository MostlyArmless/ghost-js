import * as React from "react";
import { checkForWord, getPossibleWords } from "./API";
import "./App.css";
import { GameOver } from "./components/GameOver";
import { GameSettingsPage } from "./components/GameSettingsPage";
import { NewGame } from "./components/NewGame";
import { Play } from "./components/Play";
import { GameOverReason } from "./constants";
import { GameSettings, Player, PlayerType } from "./interfaces";
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
        minimumWordLength: {
            title: "Minimum Word Length",
            value: 4,
            options: [3, 4, 5, 6]
        },
        maxNumPlayers: {
            title: "Maximum Number of Players",
            value: 4,
            options: [3, 4, 5]
        },
        wordRecognitionMode: {
            title: "Word Recognition Mode",
            value: "auto",
            options: ["auto", "manual"]
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
    constructor( props: AppProps )
    {
        super( props );
        this.state = initialState;
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

    commitNextChar = async () =>
    {
        console.log( `committing next char '${this.state.nextChar}'...` );
        const updatedGameString = this.state.gameString + this.state.nextChar;

        // Ask the server for a list of all words that start with the current game string
        if ( this.gameStringAboveMinLength( updatedGameString ) )
        {
            const possibleWordList = await getPossibleWords( updatedGameString );
            if ( possibleWordList.length == 1 )
            {
                this.gameOver( updatedGameString, GameOverReason.finishedWord );
                return;
            }
            else if ( possibleWordList.length > 1 )
            {
                this.setState( { possibleWordList: possibleWordList } );
            }
            else
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

    aiPlaceLetterAndCommit = () =>
    {
        this.setState( { nextChar: this.aiGetNextChar() } );
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
        console.log( "Get current player..." );
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
        for ( let i = 0; i < this.state.players.length; i++ )
        {
            const name = this.state.players[i].name;
            if ( name.length === 0 )
            {
                this.setState( {
                    invalidPlayerNames: true
                } );
                return;
            }
        }

        this.setState( {
            invalidPlayerNames: false,
            gameState: "playing"
        } );
    };

    handleChangeName = ( index: number, newName: string ) =>
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
        this.setState( ( previousState: AppState ) =>
        {
            const players = previousState.players;
            players[index].type = newType;
            return {
                players: players
            };
        } );
    };

    handleChangeGameSetting = ( settingName: string, value: any ) =>
    {
        this.setState( ( previousState: AppState ) =>
        {
            let newSettings = previousState.gameSettings;
            newSettings.settingName.value = value;
            console.log( newSettings );
            return {
                gameSettings: newSettings
            };
        } );
    };

    handleAddPlayer = () =>
    {
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
            const possibleWordList = await getPossibleWords( this.state.gameString );
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

    aiGetNextChar = () =>
    {
        // AI will choose the next letter based on the current string
        console.log( "Taking AI turn..." );
        let nextLetter = "";

        if ( this.state.possibleWordList.length > 0 )
        {
            const targetWord = getRandomElementFromArray( this.state.possibleWordList ); // AI will choose a new target word every turn.
            nextLetter = targetWord[this.state.gameString.length + 1];
            console.log( `AI aiming for target word "${targetWord}. Submitting next letter '${nextLetter}'` );
        } else
        {
            // AI realizes it can't do anything so it'll try to BS with a random letter
            nextLetter = getRandomLetter();
            console.log( `AI can't think of any words, bullshitting with letter '${nextLetter}'` );
        }
        return nextLetter;
    };

    private gameStringAboveMinLength( updatedGameString: string )
    {
        return updatedGameString.length >= this.state.gameSettings.minimumWordLength.value - 1;
    }

    render()
    {
        let page = <h1>Ghost Game</h1>;

        switch ( this.state.gameState )
        {
            case "newGame":
                page = (
                    <NewGame
                        list={ this.state.players }
                        handleChangeName={ this.handleChangeName }
                        handleChangePlayerType={ this.handleChangePlayerType }
                        handleRemovePlayer={ this.handleRemovePlayer }
                        handleStartClicked={ this.handleStartClicked }
                        invalidPlayerNames={ this.state.invalidPlayerNames }
                        handleAddPlayer={ this.handleAddPlayer }
                        reset={ this.resetGame }
                        handleSettingsClicked={ this.handleSettingsClicked }
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
                    />
                );
                break;
            case "settings":
                page = (
                    <GameSettingsPage
                        gameSettings={ this.state.gameSettings }
                        handleChangeGameSetting={ this.handleChangeGameSetting }
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
