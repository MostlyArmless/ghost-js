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
    onLoadFinished(): void;
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

    componentDidMount()
    {
        this.timerID = window.setTimeout(
            () => this.props.onLoadFinished(),
            this.getRandomWaitTime()
        );
    }

    private getRandomWaitTime(): number | undefined
    {
        return Math.floor( Math.random() * Math.floor( 1000 ) );
    }

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