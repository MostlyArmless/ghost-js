import React from 'react';

export class GameSetting extends React.Component {
  
  handleChangeGameSetting = (event) => {
    this.props.handleChangeGameSetting(this.props.settingTitle, event.target.value);
  }

  render() {
    const options = this.props.options.map(option => {
      return <option key={option} value={option}>{option}</option>
    });

    return (
      <tr>
        <td>{this.props.settingTitle}</td>
        <td>
          <select
            value={this.props.value}
            onChange={this.handleChangeGameSetting}>
              {options}
          </select>
        </td>
      </tr>
    );
  }
}