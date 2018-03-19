import React from 'react';
import PropTypes from 'prop-types';

export default class extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    zoomToScale: PropTypes.arrayOf(PropTypes.number),
  };

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    this._input.value = newProps.value;
  }

  render() {
    return (
      <div style={{ backgroundColor: 'rgba(100, 100, 100, .5)' }}>
        <div style={{ position: 'relative' }}>
          {this.props.zoomToScale.map((v) => <div style={{ zIndex: 10, position: 'absolute', top: '-5px', left: `${v * 100}%`, height: '2em', width: '.2em', backgroundColor: 'blue' }} />)}
        </div>
        <input
          style={{ zIndex: 100, position: 'relative' }}
          step={0.001}
          min={0}
          max={1}
          type="range"
          defaultValue={this.props.value}
          ref={(input) => { this._input = input; }}
          onMouseUp={(e) => {
            const distances = this.props.zoomToScale.map((v) => Math.abs(v - e.target.value));
            const closest = distances.indexOf(Math.min(...distances));
            e.target.value = this.props.zoomToScale[closest];
            if (this.props.onChange) {
              this.props.onChange(e.target.value);
            }
          }}
        />
      </div>
    );
  }
}
