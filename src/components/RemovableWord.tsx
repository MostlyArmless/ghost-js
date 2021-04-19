import { useState } from 'react';
import { Button } from './Button';

interface RemovableWordProps
{
    word: string;
    handleRemoveWord( word: string ): void;
}

export function RemovableWord( props: RemovableWordProps )
{
    const [removed, setRemoved] = useState( false );

    const handleClick = () =>
    {
        if ( removed )
            return;

        props.handleRemoveWord( props.word );
        setRemoved( true );
    }

    return (
        <>
            { props.word }
            { removed
                ? " - (Removed from dictionary)"
                : <Button
                    text='Remove from Dictionary'
                    onClick={ handleClick }
                /> }
        </>
    );
}