import React from 'react';

const initialState = {
    value: 1
}

export class PlayerTypeSelect extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChangePlayerType = (event) => {
    this.props.handleChangePlayerType(this.props.id, event.target.value);
  }

  // TODO - figure out how to render all the things on the same line even though we're returning a div here
  render() {
    return (
      <>
        <select
          value={this.props.playerType}
          onChange={this.handleChangePlayerType}
        >
          <option value={'Human'}>Human</option>
          <option value={'AI'}>AI</option>
        </select>
      </>
    );
  }
}