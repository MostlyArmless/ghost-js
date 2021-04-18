import { PlayerType } from '../interfaces';

interface PlayerTypeSelectProps
{
  id: number;
  playerType: PlayerType;
  handleChangePlayerType( id: number, value: PlayerType ): void;
}

export function PlayerTypeSelect( props: PlayerTypeSelectProps )
{
  const handleChangePlayerType = ( event: any ) =>
  {
    props.handleChangePlayerType( props.id, event.target.value );
  }

  return (
    <>
      <select
        value={ props.playerType }
        onChange={ handleChangePlayerType }
      >
        <option value={ 'Human' }>Human</option>
        <option value={ 'AI' }>AI</option>
      </select>
    </>
  );
}