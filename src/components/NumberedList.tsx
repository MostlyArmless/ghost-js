interface NumberedListProps
{
    data: string[];
}

export function NumberedList( props: NumberedListProps )
{
    return (
        <ol>
            { props.data.map( ( item: string ) =>
            {
                return ( <li key={ item }>{ item }</li> );
            } )
            }
        </ol>
    );
}