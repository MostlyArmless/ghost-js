import * as React from 'react';

interface ButtonProps
{
  id?: number;
  className?: string;
  onClick( id?: number ): void
  text: string;
}

interface ButtonState
{

}

export class Button extends React.Component<ButtonProps, ButtonState>
{
  handleClick = () =>
  {
    if ( this.props.onClick )
    {
      this.props.onClick( this.props.id );
    }
  };

  render()
  {
    return (
      <button
        key={ this.props.id }
        onClick={ this.handleClick }
        className={ this.props.className }
      >
        { this.props.text }
      </button>
    );
  }
}