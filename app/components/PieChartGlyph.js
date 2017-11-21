import React from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';

import { colorForYear, rgbString } from '../utils/colors';
function formatData(data) {
  return {
    labels: Object.keys(data.years).map((year) => year.toString()),
    datasets: [{
      label: '# of books',
      data: Object.keys(data.years).map((year) => data.years[year]),
      backgroundColor: Object.keys(data.years).map((year) => rgbString(colorForYear(year))),
      borderWidth: 0.5,
    }],
  };
}

export default class PieChartGlyph extends React.Component {
  componentWillMount() {
    this.state = { showTooltip: false, selectedPart: null };
  }

  componentDidMount() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: formatData(this.props.data),
        options: {
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
            custom: (event) => {
              this.setState({ selectedPart: !event.afterBody ? null : event.dataPoints[0].index });
            },
          },
        },
      });
    }
  }

  showTooltip = (show = true) => () => this.setState({ showTooltip: show });

  tooltip = () => {
    if (!this.state.showTooltip) {
      return null;
    }
    return (
      <div style={{ overflow: 'visible', position: 'absolute', bottom: '80%', backgroundColor: 'rgba(255,255,255,.9)' }}>
        {Object.keys(this.props.data.years).map((year, idx) => (
          <div style={{ whiteSpace: 'nowrap', fontWeight: this.state.selectedPart === idx ? 'bold' : 'normal' }}>
            <div style={{ height: '10px', width: '10px', backgroundColor: rgbString(colorForYear(year)), display: 'inline-block' }} />
            &nbsp;{year}: {this.props.data.years[year]}
          </div>
        ))}
      </div>
    );
  };

  render() {
    if (!this.props.data) return null;

    return (
      <div
        style={{ width: '100%', height: '100%', opacity: this.state.showTooltip ? 1 : 0.7 }}
        onMouseEnter={this.showTooltip()}
        onMouseLeave={this.showTooltip(false)}
        onClick={() => console.log(this.props.id)}
      >
        { this.tooltip() }
        <canvas
          ref={(canvas) => { this.canvas = canvas; }}
          id="myChart"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }
}

PieChartGlyph.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
};
