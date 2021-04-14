import React from 'react';
import { Button } from './Button';
import { NameField } from './NameField';
import { IPlayer, PlayerType } from '../interfaces';
import { PlayerTypeSelect } from './PlayerTypeSelect';
import { NumberedList } from './NumberedList';

interface NewGameProps
{
    playerList: IPlayer[];
    handleRenamePlayer( index: number, newName: string ): void;
    handleChangePlayerType( index: number, newType: PlayerType ): void;
    handleAddPlayer(): void;
    handleRemovePlayer( index: number ): void;
    handleStartClicked(): void;
    reset(): void;
    handleSettingsClicked(): void;
    isAnyPlayerNameInvalid: boolean;
    whitelistedWords: string[];
    blacklistedWords: string[];
    handleHelp(): void;
    clearBlacklist(): Promise<void>;
    clearWhitelist(): Promise<void>;
    refreshBlacklist(): Promise<void>;
    refreshWhitelist(): Promise<void>;
}

interface NewGameState
{
    blacklistVisible: boolean;
    whitelistVisible: boolean;
}

const initialState: NewGameState = {
    blacklistVisible: false,
    whitelistVisible: false,
}

export class NewGame extends React.Component<NewGameProps, NewGameState> {

    constructor( props: NewGameProps )
    {
        super( props );
        this.state = initialState;
    }

    toggleBlacklistVisibility = async () =>
    {
        this.setState( ( previousState ) =>
        {
            if ( !previousState.blacklistVisible )
                this.props.refreshBlacklist();

            return { blacklistVisible: !previousState.blacklistVisible };
        } );
    }

    toggleWhitelistVisibility = async () =>
    {
        this.setState( ( previousState ) =>
        {
            if ( !previousState.whitelistVisible )
                this.props.refreshWhitelist();
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
                    <Button key={ id + '_button' } id={ id } onClick={ this.props.handleRemovePlayer } text='Remove Player' /> }
            </div> );
        } );
    }

    private buildBlacklist()
    {
        const button = this.props.blacklistedWords.length > 0 &&
            <Button
                text='Clear Blacklist'
                onClick={ this.props.clearBlacklist }
            />

        return (
            <>
                <h2>Blacklisted words:</h2>
                { button }
                { this.props.blacklistedWords.length > 0 ? <NumberedList data={ this.props.blacklistedWords } /> : <p>No words have been blacklisted yet.</p> }
            </>
        );
    }

    private buildWhitelist()
    {
        const shouldShow = this.props.whitelistedWords.length > 0;

        const button = shouldShow &&
            <Button
                text='Clear Whitelist'
                onClick={ this.props.clearWhitelist }
            />

        return (
            <>
                <h2>Whitelisted words:</h2>
                { button }
                { this.props.whitelistedWords.length > 0 ? <NumberedList data={ this.props.whitelistedWords } /> : <p>No words have been added to the dictionary yet.</p> }
            </>
        );
    }

    render()
    {
        const invalidPlayerWarning = this.props.isAnyPlayerNameInvalid && <h2>Player names must be unique and non-blank</h2>

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