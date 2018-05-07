import React from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
              // event.afterBody is only set when mouseOver, not set on mouseLeave
              this.setState({ selectedPart: !event.afterBody ? null : event.dataPoints[0].index });
            },
          },
        },
      });
    }
  }

  tooltip = () => {
    if (!this.state.showTooltip) {
      return null;
    }
    return (
      <TooltipContainer>
        {Object.keys(this.props.data.years).map((year, idx) => (
          <TooltipYear key={year} active={this.state.selectedPart === idx} color={rgbString(colorForYear(year))}>
            <span>{year}: {this.props.data.years[year]}</span>
          </TooltipYear>
        ))}
      </TooltipContainer>
    );
  };

  showTooltip = (show = true) => () => !this.props.noTooltip && this.setState({ showTooltip: show });

  render() {
    if (!this.props.data) return null;

    return (
      <GlyphContainer
        role="button"
        tabIndex={this.props.id}
        active={this.state.showTooltip}
        onMouseEnter={this.showTooltip()}
        onMouseLeave={this.showTooltip(false)}
        onClick={() => this.props.onClick && this.props.onClick(this.props.id)}
      >
        { this.tooltip() }
        <canvas
          ref={(canvas) => { this.canvas = canvas; }}
          id="myChart"
          style={{ width: '100%', height: '100%' }}
          width={this.props.size || 'auto'}
          height={this.props.size || 'auto'}
        />
      </GlyphContainer>
    );
  }
}

PieChartGlyph.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
  size: PropTypes.number,
  onClick: PropTypes.func,
  noTooltip: PropTypes.bool,
};

const GlyphContainer = styled.div`
  width: 100%;
  height: 100%;
  opacity: ${(props) => props.active ? 1 : 0.7};
`;

const TooltipContainer = styled.div`
  overflow: visible;
  position: absolute;
  bottom: 80%;
  background-color: rgba(255,255,255,.9);
`;

const TooltipYear = styled.div`
  white-space: nowrap;
  font-weight: ${(props) => props.active ? 'bold' : 'normal'};
  >:first-child:before {
    content: '';
    height: 10px;
    width: 10px;
    background-color: ${(props) => props.color};
    display: inline-block;
    margin-right: 5px;
    margin-left: 2px;
  }
`;
