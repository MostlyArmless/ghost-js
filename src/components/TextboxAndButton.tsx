import * as React from 'react';
import { ENTER_KEY_CODE } from '../constants';
import { Button } from './Button';

interface TextboxAndButtonProps
{
    buttonText: string;
    onSubmit( textboxContents: string ): Promise<void> | void; //? Is it bad practice to allow either async or sync funcs under the same name? Is there a better way?
    id?: string;
}

interface TextboxAndButtonState
{
    textboxContent: string;
}

const initialState: TextboxAndButtonState = {
    textboxContent: ''
}

export class TextboxAndButton extends React.Component<TextboxAndButtonProps, TextboxAndButtonState>
{
    constructor( props: TextboxAndButtonProps )
    {
        super( props );
        this.state = initialState;
    }

    reset = () =>
    {
        this.setState( initialState );
    }

    submitAndReset = async () =>
    {
        await this.props.onSubmit( this.state.textboxContent );
        this.reset();
    }

    handleTextChanged = ( event: any ) =>
    {
        this.setState( { textboxContent: event.target.value } );
    }

    onKeyDown = ( event: React.KeyboardEvent<HTMLInputElement> ) =>
    {
        if ( event.keyCode === ENTER_KEY_CODE )
        {
            this.submitAndReset();
        }
    }

    onClick = () =>
    {
        this.submitAndReset();
    }

    render()
    {
        return (
            <>
                <input
                    autoComplete='off'
                    onChange={ this.handleTextChanged }
                    id={ `${this.props.id}_textbox` }
                    type='text'
                    maxLength={ 50 }
                    onKeyDown={ this.onKeyDown }
                    value={ this.state.textboxContent }
                />
                <Button
                    text={ this.props.buttonText }
                    onClick={ this.onClick }
                    id={ `${this.props.id}_button` }
                />
            </>
        );
    }
}