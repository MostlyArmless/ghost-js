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
        console.log( `Startup mounted` );
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

    componentDidUpdate()
    {
        console.log( this.state );
    }

    render()
    {
        let message;
        if ( this.state.serverCannotBeReached )
        {
            message = <p>Server cannot be reached. Try reloading this page.</p>
        }
        else if ( this.state.serverIsLoaded )
        {
            message = <Button
                text="New Game"
                onClick={ this.props.handleNewGame } />;
        }
        else
        {
            message = <p>Waiting for sever to come online...</p>;
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