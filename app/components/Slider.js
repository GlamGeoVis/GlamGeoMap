import React from 'react';

export default class extends React.Component {
  render() {
    return (
      <input
        type="range"
        defaultValue={this.props.value}
        onChange={(e) => this.props.onChange && this.props.onChange(e.target.value)}
      />
    )
  }
}