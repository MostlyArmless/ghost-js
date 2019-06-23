import React from 'react';

export function Button(props) {
  handleClick = () => {
    if (props.onClick) {
      props.onClick(props.id);
    }
  };

  return (
    <button
      key={props.id}
      onClick={this.handleClick}>
      {props.text}
    </button>
  );
}