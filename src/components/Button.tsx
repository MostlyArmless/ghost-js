interface ButtonProps
{
  id?: string | number;
  className?: string;
  onClick( id?: number | string ): void
  text: string;
}

export function Button( props: ButtonProps )
{
  const handleClick = () =>
  {
    if ( props.onClick )
      props.onClick( props.id );
  };

  return (
    <button
      key={ props.id }
      onClick={ handleClick }
      className={ props.className }
    >
      { props.text }
    </button>
  );
}