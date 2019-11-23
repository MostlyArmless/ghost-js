import * as React from 'react';
import { Button } from './Button';

interface RemovableWordProps
{
    word: string;
    handleRemoveWord( word: string ): void;
}

interface RemovableWordState
{
    hasBeenRemoved: boolean;
}

const initialState: RemovableWordState = {
    hasBeenRemoved: false
}

export class RemovableWord extends React.Component<RemovableWordProps, RemovableWordState>
{
    constructor( props: RemovableWordProps )
    {
        super( props );
        this.state = initialState;
    }

    handleClick = () =>
    {
        if ( this.state.hasBeenRemoved )
            return;

        this.props.handleRemoveWord( this.props.word );
        this.setState( { hasBeenRemoved: true } );
    }

    render()
    {

        const removeButton = <Button
            text='Remove from Dictionary'
            onClick={ this.handleClick }
        />;

        const alreadyRemovedText = " - (Removed from dictionary)";

        return (
            <>
                { this.props.word }
                { this.state.hasBeenRemoved ? alreadyRemovedText : removeButton }
            </>
        );
    }
}