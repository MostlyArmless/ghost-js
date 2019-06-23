import React from 'react';

const initialState = {
    value: 1
}

export class COMPONENT extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    return (
      <div>
        Stuff
      </div>
    );
  }
}