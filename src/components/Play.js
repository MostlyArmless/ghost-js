import React from 'react';
import { TextBox } from './TextBox';

// TODO - use the state for something or convert this into a pure function
const initialState = {
  stuff: "things"
}

export class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    return (
      <div className="App">
        <p>It is currently {this.props.getCurrentPlayer()}'s turn</p>
        <TextBox
          checkForWord={this.checkForWord}
          nextTurn={this.nextTurn}
          wordDict={this.state.wordDict}
        />
      </div>
    );
  }
}