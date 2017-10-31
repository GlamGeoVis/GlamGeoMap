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
  const marginLeft = 20;

  for (let i = start; i < end; i += 1) {
    data.push({
      value: Math.random() * 10,
      year: i,
    });

    ordinals.push(i);
  }

  const width = document.getElementById('d3').scrollWidth;
  const height = 100;

  const svg = d3.select('#d3')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 120)
    .append('g');

  // x maps year to pixels
  const x = d3.scaleLinear()
    .domain([reactElement.state.zoomStart, reactElement.state.zoomEnd])
    .range([marginLeft, width]);

  let currentX = x;

  // for the year bins (maps index to pixels, has bandWidth)
  const xBand = d3.scaleBand()
    .domain(d3.range(0, data.length))
    .range(x.range())
    .paddingInner(0.1)
  ;

  // maps index to pixels
  const xScale = x.copy().domain([0, data.length]);

  // maps Y value to height (inverse, large height means small bar)
  const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d) => d.value)]);

  const zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed);

  // zoomable group
  const bg = svg.append('g')
    .attr('width', width - marginLeft)
    .attr('x', marginLeft)
    .attr('height', height + 40)
    .call(zoom);

  // this is to catch all events for zooming
  bg.append('rect')
    .attr('width', width - marginLeft)
    .attr('x', marginLeft)
    .attr('height', height + 40)
    .attr('fill', 'white');

  // background colour for graph
  bg.append('rect')
    .attr('width', width - marginLeft)
    .attr('x', marginLeft)
    .attr('height', height)
    .attr('fill', '#333');

  const setXAxis = (scale) => d3.axisBottom(scale).tickFormat((d) => data[d] && data[d].year);

  const xAxis = bg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(0, ${height})`)
    .call(setXAxis(xScale));

  // y-axis
  bg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale));

  // define clippath to hide overflow
  svg.append('defs')
    .append('clipPath')
    .attr('id', 'my-clip-path')
    .append('rect')
    .attr('width', width - marginLeft)
    .attr('x', marginLeft)
    .attr('height', height);

  const bars = bg.append('g')
    .attr('clip-path', 'url(#my-clip-path)')
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xBand(i))
    .attr('y', (d) => yScale(d.value))
    .attr('width', xBand.bandwidth())
    .attr('height', (d) => height - yScale(d.value))
    .attr('fill', '#0ff')
  ;

  const brush = d3.brushX()
    .extent([[marginLeft, 0], [width, height]])
    .on('end', brushended)
    .handleSize(24);

  const brushElm = bg.append('g')
    .attr('class', 'brush')
    .call(brush);

  let x1 = 1700;
  let x2 = 1800;

  function zoomed() {
    const t = d3.event.transform;
    // t.k is scale factor, t.x is panning

    // transform x axis
    xAxis.call(setXAxis(t.rescaleX(xScale)));

    // update bars
    currentX = t.rescaleX(x);
    const xBandTransformed = xBand.domain(d3.range(0, data.length / t.k));
    bars.attr('x', (d) => currentX(d.year) - (xBandTransformed.bandwidth() / 2))
        .attr('width', xBandTransformed.bandwidth())
    ;

    // update brush
    const minimumYear = currentX.invert(marginLeft);
    if (x1 < minimumYear) {
      x1 = minimumYear;
    }
    const maximumYear = currentX.invert(width);
    if (x2 > maximumYear) {
      x2 = maximumYear;
    }
    brushElm.call(brush.move, [x1, x2].map(currentX));
  }

  function brushended() {
    const years = d3.event.selection.map(currentX.invert);
    x1 = years[0];
    x2 = years[1];
    if (Math.round(x1) !== x1 || Math.round(x2) !== x2) {
      x1 = Math.round(x1);
      x2 = Math.round(x2);
      brushElm.call(brush.move, [x1, x2].map(currentX));
    }
  }
}
