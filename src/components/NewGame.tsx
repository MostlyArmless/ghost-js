import React from 'react';
import { Button } from './Button';
import { NameField } from './NameField';
import { Player, PlayerType } from '../interfaces';
import { PlayerTypeSelect } from './PlayerTypeSelect';

interface NewGameProps
{
    playerList: Player[];
    handleRenamePlayer( index: number, newName: string ): void;
    handleChangePlayerType( index: number, newType: PlayerType ): void;
    handleAddPlayer(): void;
    handleRemovePlayer( index: number ): void;
    handleStartClicked(): void;
    reset(): void;
    handleSettingsClicked(): void;
    invalidPlayerNames: boolean;
    getBlacklist(): Promise<string[]>;
    getWhitelist(): Promise<string[]>;
    handleHelp(): void;
    clearBlacklist(): Promise<void>;
    clearWhitelist(): Promise<void>;
}

interface NewGameState
{
    blacklistVisible: boolean;
    whitelistVisible: boolean;
    blacklist: string[];
    whitelist: string[];
}

const initialState: NewGameState = {
    blacklistVisible: false,
    whitelistVisible: false,
    blacklist: [],
    whitelist: []
}

export class NewGame extends React.Component<NewGameProps, NewGameState> {

    constructor( props: NewGameProps )
    {
        super( props );
        this.state = initialState;
    }

    clearBlacklist = async () =>
    {
        await this.props.clearBlacklist();
        this.setState( {
            blacklist: await this.props.getBlacklist()
        } );
    }

    clearWhitelist = async () =>
    {
        await this.props.clearWhitelist();
        this.setState( {
            whitelist: await this.props.getWhitelist()
        } );
    }

    async componentWillMount()
    {
        this.setState( {
            blacklist: await this.props.getBlacklist(),
            whitelist: await this.props.getWhitelist()
        } );
    }

    toggleBlacklistVisibility = () =>
    {
        this.setState( ( previousState ) =>
        {
            return { blacklistVisible: !previousState.blacklistVisible };
        } );
    }

    toggleWhitelistVisibility = () =>
    {
        this.setState( ( previousState ) =>
        {
            return { whitelistVisible: !previousState.whitelistVisible };
        } );
    }

    private buildPlayerList()
    {
        return this.props.playerList.map( ( player, id ) =>
        {
            return ( <div key={ id + "_div" }>
                <NameField playerName={ player.name } id={ id } handleChangeName={ this.props.handleRenamePlayer } />

                <PlayerTypeSelect id={ id } playerType={ player.type } handleChangePlayerType={ this.props.handleChangePlayerType } />

                { id > 1 &&
                    <Button key={ id + '_button' } id={ id } onClick={ this.props.handleRemovePlayer } text='Delete' /> }
            </div> );
        } );
    }

    private buildBlacklist()
    {
        const button = this.state.blacklist.length > 0 &&
            <Button
                text='Clear Blacklist'
                onClick={ this.clearBlacklist }
            />

        return (
            <>
                <h2>Blacklisted words:</h2>
                { button }
                <ol>
                    { this.state.blacklist.map( ( word: string ) => { return ( <li key={ word }>{ word }</li> ); } ) }
                </ol>
            </>
        );
    }

    private buildWhitelist()
    {
        const button = this.state.whitelist.length > 0 &&
            <Button
                text='Clear Whitelist'
                onClick={ this.clearWhitelist }
            />

        return (
            <>
                <h2>Whitelisted words:</h2>
                { button }
                <ol>
                    { this.state.whitelist.map( ( word: string ) => { return <li key={ word }>{ word }</li>; } ) }
                </ol>
            </>
        );
    }

    render()
    {
        const invalidPlayerWarning = this.props.invalidPlayerNames && <h2>Player names must be unique and non-blank</h2>

        const playerList = this.buildPlayerList();
        const blacklist = this.state.blacklistVisible && this.buildBlacklist();
        const whitelist = this.state.whitelistVisible && this.buildWhitelist();

        return (
            <div className='newGame'>
                <h2>New Game</h2>
                { invalidPlayerWarning }
                <Button
                    onClick={ this.props.reset }
                    text='Reset Game'
                />
                <Button
                    className='startGame'
                    onClick={ this.props.handleStartClicked }
                    text='Start Game'
                />
                <Button
                    onClick={ this.props.handleSettingsClicked }
                    text='Settings'
                />
                <Button
                    onClick={ this.props.handleHelp }
                    text="Help"
                />
                <fieldset>
                    { playerList }
                    <Button
                        onClick={ this.props.handleAddPlayer }
                        text='Add Player'
                    />
                </fieldset>

                <Button
                    onClick={ this.toggleBlacklistVisibility }
                    text={ this.state.blacklistVisible ? 'Hide Blacklist' : 'Show Blacklist' }
                />
                <Button
                    onClick={ this.toggleWhitelistVisibility }
                    text={ this.state.whitelistVisible ? 'Hide Whitelist' : 'Show Whitelist' }
                />
                { blacklist }
                { whitelist }
            </div>
        );
    }
}