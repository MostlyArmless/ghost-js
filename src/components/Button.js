import React from 'react';

export class Button extends React.Component {
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  };

  render() {
    return (
      <button
        key={this.props.id}
        onClick={this.handleClick}>
        {this.props.text}
      </button>
    );
  }
}