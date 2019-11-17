import React from 'react';

const initialState = {
  dummyValue: 1
}

export class PlayerTypeSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChangePlayerType = (event) => {
    console.log('stuff');
    this.props.handleChangePlayerType(this.props.id, event.target.value);
  }

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