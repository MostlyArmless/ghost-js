import * as React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = `
    display: block;
    margin: 0 auto;
    border-color: red;
`;

interface SpinnerProps
{
    loading: boolean;
}

interface SpinnerState
{

}

export class Spinner extends React.Component<SpinnerProps, SpinnerState> {

    timerID: number;
    constructor( props: SpinnerProps )
    {
        super( props );
        this.timerID = 0;
    }

    // TODO - figure out how to implement this lifecycle func with react hooks, then convert this class to a func component
    componentWillUnmount()
    {
        clearInterval( this.timerID );
    }

    render()
    {
        return (
            <div className='sweet-loading'>
                <ClipLoader
                    css={ override }
                    sizeUnit={ "px" }
                    size={ 150 }
                    color={ '#123abc' }
                    loading={ this.props.loading }
                />
            </div>
        )
    }
}