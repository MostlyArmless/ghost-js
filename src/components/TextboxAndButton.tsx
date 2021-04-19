import { useState } from 'react';
import { Button } from './Button';

interface TextboxAndButtonProps
{
    buttonText: string;
    onSubmit( textboxContents: string ): Promise<void> | void; //? Is it bad practice to allow either async or sync funcs under the same name? Is there a better way?
    id?: string;
}

export function TextboxAndButton( props: TextboxAndButtonProps )
{
    const [textboxContent, setTextboxContent] = useState( '' );

    const submitAndReset = async () =>
    {
        await props.onSubmit( textboxContent );
        setTextboxContent( '' );
    }

    return (
        <>
            <input
                autoComplete='off'
                onChange={ ( event ) => { setTextboxContent( event.target.value ) } }
                id={ `${props.id}_textbox` }
                type='text'
                maxLength={ 50 }
                onKeyDown={ ( event ) => { if ( event.key === "Enter" ) submitAndReset(); } }
                value={ textboxContent }
            />

            <Button
                text={ props.buttonText }
                onClick={ submitAndReset }
                id={ `${props.id}_button` }
            />
        </>
    );
}