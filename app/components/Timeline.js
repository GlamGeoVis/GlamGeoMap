import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import './timeline.css';
import { setTimeRange } from '../containers/Timeline/actions';

const start = 1500;
const end = 2000;

export default class Timeline extends React.Component {
  state = {
    zoomStart: start,
    zoomEnd: end,
  };

  componentDidMount() {
    init_d3(this);
  }

  setSelectionValues = (values) => {
    this.props.dispatch(setTimeRange(values[0], values[1]));
  };

  zoom = (scale, xMoved) => { // called from d3 zoom
    // scale is scale factor, eg scale == 2 means zoomed to double size
    // xMoved is negative, -1 means completely scrolled to the right
    const range = (end - start) / scale;
    const zoomStart = Math.round(start - (xMoved * range));
    const zoomEnd = Math.round(zoomStart + range);
    this.setState({ zoomStart, zoomEnd });
    if (this.props.range.start < zoomStart) {
      this.props.dispatch(setTimeRange(zoomStart, this.props.range.end));
    }
    if (this.props.range.end > zoomEnd) {
      this.props.dispatch(setTimeRange(this.props.range.start, zoomEnd));
    }
  };

  render() {
    const leftButtonPosition =
      (this.props.range.start - this.state.zoomStart) / (this.state.zoomEnd - this.state.zoomStart);

    return (
      <div>
        <div style={{ width: '100%', marginBottom: '-5px' }} id="d3" />
        <Range
          step={1}
          min={this.state.zoomStart}
          max={this.state.zoomEnd}
          value={[this.props.range.start, this.props.range.end]}
          onChange={this.setSelectionValues}
          // handle={(props) => <span>{JSON.stringify(props)}</span>}
        />
        <div style={{ position: 'absolute', marginTop: '5px', left: 100*leftButtonPosition+'%'}}>
          { this.props.range.start }
        </div>
        <div style={{ float: 'left' }}>{Math.round(this.state.zoomStart)}</div>
        <div style={{ float: 'right' }}>{Math.round(this.state.zoomEnd)}</div>
      </div>
    );
  }
}

Timeline.propTypes = {
  range: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }),
  dispatch: PropTypes.func.isRequired,
};

const init_d3 = (reactElement) => {
  const data = [];
  const ordinals = [];

  for (let i = start; i < end; i++) {
    data.push({
      value: Math.random() * 10,
      year: i,
    });

    ordinals.push(i);
  }

  let width = document.getElementById('d3').scrollWidth;
  let height = 100;
  let radius = (Math.min(width, height) / 2) - 10;

  const svg = d3.select('#d3')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 100)
    .append('g')
    .call(
      d3.zoom()
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on('zoom', zoom)
    );
  console.log(svg);
  // the scale
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const xScale = x.domain([-1, ordinals.length]);
  const yScale = y.domain([0, d3.max(data, (d) => d.value)]);
  // for the width of rect
  const xBand = d3.scaleBand().domain(d3.range(-1, ordinals.length)).range([0, width]);

  // zoomable rect
  svg.append('rect')
    .attr('class', 'zoom-panel')
    .attr('width', width)
    .attr('height', height);

  // x axis
  const xAxis = svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(0, ${height})`)
    .call(
      d3.axisBottom(xScale).tickFormat((d, e) => ordinals[d])
    );

  // y axis
  const yAxis = svg.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale));

  const bars = svg.append('g')
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => xScale(i) - xBand.bandwidth() * 0.9 / 2)
    .attr('y', (d, i) => yScale(d.value))
    .attr('width', xBand.bandwidth() * 0.9)
    .attr('height', (d) => height - yScale(d.value));

  const hideTicksWithoutLabel = function () {
    d3.selectAll('.xAxis .tick text').each(function (d) {
      if (this.innerHTML === '') {
        this.parentNode.style.display = 'none';
      }
    });
  };

  function zoom() {
    if (d3.event.transform.k < 1) {
      d3.event.transform.k = 1;
      return;
    }

    // xAxis.call(
    //   d3.axisBottom(d3.event.transform.rescaleX(xScale)).tickFormat((d, e, target) => {
    //     // has bug when the scale is too big
    //     if (Math.floor(d) === d3.format('.1f')(d)) return ordinals[Math.floor(d)];
    //     return ordinals[d];
    //   })
    // );

    hideTicksWithoutLabel();

    // the bars transform
    bars.attr('transform', `translate(${d3.event.transform.x},0)scale(${d3.event.transform.k},1)`);
    reactElement.zoom(d3.event.transform.k, d3.event.transform.x / width);
    // console.log(d3.event.transform.k, d3.event.transform.x / width);
    // console.log(xScale(600));
  }
}
