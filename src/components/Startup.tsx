import * as React from 'react';
import { Spinner } from './Spinner';
import { Button } from './Button';

interface StartupProps
{
    waitForServerToComeOnline(): Promise<boolean>
    handleNewGame(): void;
}

interface StartupState
{
    serverIsLoaded: boolean;
    serverCannotBeReached: boolean;
}

const initialState: StartupState = {
    serverIsLoaded: false,
    serverCannotBeReached: false
}

export class Startup extends React.Component<StartupProps, StartupState>
{
    constructor( props: StartupProps )
    {
        super( props );
        this.state = initialState;
    }

    async componentDidMount()
    {
        this.setState( { serverIsLoaded: false }, this.pingServer );
    }

    pingServer = async () =>
    {
        const isServerOnline = await this.props.waitForServerToComeOnline();
        if ( isServerOnline )
        {
            this.setState( {
                serverIsLoaded: true,
                serverCannotBeReached: false
            } );
        }
        else
        {
            this.setState( {
                serverIsLoaded: false,
                serverCannotBeReached: true
            } );
        }
    }

    render()
    {
        let message;
        if ( this.state.serverCannotBeReached )
        {
            message = <p>Server didn't respond within the timeout. Try refreshing the page.</p>
        }
        else if ( this.state.serverIsLoaded )
        {
            message = <Button
                text="New Game"
                onClick={ this.props.handleNewGame } />;
        }
        else
        {
            message = <p>Waiting for Heroku ghost-word-server to come online...</p>;
        }

        return (
            <>
                <h2>Welcome to ghost-js!</h2>
                { message }
                <Spinner
                    loading={ !this.state.serverIsLoaded && !this.state.serverCannotBeReached }
                />

            </>
        );
    }
}