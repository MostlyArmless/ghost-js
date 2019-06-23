import React from 'react';

export class GameSettings extends React.Component {

  handleChangeMinWordLength = (event) => {
    this.props.handleChangeMinWordLength(event.target.value);
  }

  render() {
    return (
      <div>
        <table className='center'>
          <tbody>
            <tr>
              <td>Minimum Word Length</td>
              <td>
                <select
                  value={this.props.gameSettings.minWordLength}
                  onChange={this.handleChangeMinWordLength}>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <button onClick={this.props.handleSettingsDoneClicked}>Done</button>
      </div>
    );
  }
}