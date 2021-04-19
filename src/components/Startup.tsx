import * as React from 'react';
import { Spinner } from './Spinner';
import { Button } from './Button';

interface StartupProps
{
    waitForServerToComeOnline(): Promise<boolean>
    handleNewGame(): void;
}

export function Startup( props: StartupProps )
{
    const [serverIsLoaded, setServerIsLoaded] = React.useState( false );
    const [serverCannotBeReached, setServerCannotBeReached] = React.useState( false );

    const pingServer = React.useCallback( async () =>
    {
        const isServerOnline = await props.waitForServerToComeOnline();
        setServerIsLoaded( isServerOnline );
        setServerCannotBeReached( !isServerOnline );
    }, [props] );

    React.useEffect( () =>
    {
        setServerIsLoaded( false );
        pingServer();
    }, [pingServer] );

    return (
        <>
            <h2>Welcome to ghost-js!</h2>
            { serverCannotBeReached && <p>Server didn't respond within the timeout. Try refreshing the page.</p> }
            { serverIsLoaded && <Button
                text="New Game"
                onClick={ props.handleNewGame } /> }
            { ( !serverCannotBeReached && !serverIsLoaded ) &&
                <p>Waiting for Heroku ghost-word-server to come online...</p> }
            <Spinner
                loading={ !serverIsLoaded && !serverCannotBeReached }
            />

        </>
    );
}