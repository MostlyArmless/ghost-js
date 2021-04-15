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

export function NewGame( props: NewGameProps )
{
    const [isBlacklistVisible, setIsBlacklistVisible] = React.useState( false );
    const [isWhitelistVisible, setIsWhitelistVisible] = React.useState( false );

    const toggleBlacklistVisibility = async () =>
    {
        if ( !isBlacklistVisible )
            await props.refreshBlacklist();

        setIsBlacklistVisible( !isBlacklistVisible );
    }

    const toggleWhitelistVisibility = async () =>
    {
        if ( !isWhitelistVisible )
            await props.refreshWhitelist();

        setIsWhitelistVisible( !isWhitelistVisible );
    }

    const buildPlayerList = () =>
    {
        return props.playerList.map( ( player, id ) =>
        {
            return ( <div key={ id + "_div" }>
                <NameField playerName={ player.name } id={ id } handleChangeName={ props.handleRenamePlayer } />

                <PlayerTypeSelect id={ id } playerType={ player.type } handleChangePlayerType={ props.handleChangePlayerType } />

                { id > 1 &&
                    <Button key={ id + '_button' } id={ id } onClick={ props.handleRemovePlayer } text='Remove Player' /> }
            </div> );
        } );
    }

    const buildBlacklist = () =>
    {
        const button = props.blacklistedWords.length > 0 &&
            <Button
                text='Clear Blacklist'
                onClick={ props.clearBlacklist }
            />

        return (
            <>
                <h2>Blacklisted words:</h2>
                { button }
                { props.blacklistedWords.length > 0 ? <NumberedList data={ props.blacklistedWords } /> : <p>No words have been blacklisted yet.</p> }
            </>
        );
    }

    const buildWhitelist = () =>
    {
        const shouldShow = props.whitelistedWords.length > 0;

        const button = shouldShow &&
            <Button
                text='Clear Whitelist'
                onClick={ props.clearWhitelist }
            />

        return (
            <>
                <h2>Whitelisted words:</h2>
                { button }
                { props.whitelistedWords.length > 0 ? <NumberedList data={ props.whitelistedWords } /> : <p>No words have been added to the dictionary yet.</p> }
            </>
        );
    }

    return (
        <div className='newGame'>
            <h2>New Game</h2>
            {
                props.isAnyPlayerNameInvalid &&
                <h2>Player names must be unique and non-blank</h2>
            }
            <Button
                onClick={ props.reset }
                text='Reset Game'
            />
            <Button
                className='startGame'
                onClick={ props.handleStartClicked }
                text='Start Game'
            />
            <Button
                onClick={ props.handleSettingsClicked }
                text='Settings'
            />
            <Button
                onClick={ props.handleHelp }
                text="Help"
            />
            <fieldset>
                { buildPlayerList() }
                <Button
                    onClick={ props.handleAddPlayer }
                    text='Add Player'
                />
            </fieldset>

            <Button
                onClick={ toggleBlacklistVisibility }
                text={ isBlacklistVisible ? 'Hide Blacklist' : 'Show Blacklist' }
            />
            <Button
                onClick={ toggleWhitelistVisibility }
                text={ isWhitelistVisible ? 'Hide Whitelist' : 'Show Whitelist' }
            />
            { isBlacklistVisible && buildBlacklist() }
            { isWhitelistVisible && buildWhitelist() }
        </div>
    );
}