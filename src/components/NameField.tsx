export interface INameFieldProps
{
    id: number;
    playerName: string;
    handleRenamePlayer( index: number, newName: string ): void;
}

export function NameField( props: INameFieldProps )
{
    return (
        <input
            key={ props.id + '_name' }
            type='text'
            value={ props.playerName }
            onChange={ ( event ) => { props.handleRenamePlayer( props.id, event.target.value ) } } />
    );
}