import React from 'react';

export class NameField extends React.Component {
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  };

  handleChangeName = (event) => {
    this.props.handleChangeName(this.props.id, event.target.value);
  }

  render() {
    return (
      <input
        key={this.props.id + '_name'}
        type='text'
        value={this.props.playerName}
        onChange={this.handleChangeName} />
    );
  }
}