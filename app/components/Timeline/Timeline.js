import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styled from 'styled-components';
import { setTimeRange } from '../../containers/Timeline/actions';

export default class Timeline extends React.Component {
  componentDidMount() {
    initD3(this.props.minYear, this.props.maxYear, this.setSelectionValues);
  }

  setSelectionValues = (start, end) => {
    this.props.dispatch(setTimeRange(start, end));
  };

  render() {
    return (
      <TimelineRoot id="d3_timeline" />
    );
  }
}

const TimelineRoot = styled.div`
  & > div#d3 {
    width: 100%;
    margin-bottom: -5px;
  }
  & .bar {
    fill: steelblue;
  }
`;

Timeline.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  range: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }),
  dispatch: PropTypes.func.isRequired,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
};

const initD3 = (startYear, endYear, callback) => {
  const data = [];
  const ordinals = [];
  const marginLeft = 20;
  let hasBrushed = false;
  let brushRange = [startYear, endYear];

  for (let i = startYear; i < endYear; i += 1) {
    data.push({
      value: Math.random() * 10,
      year: i,
    });

    ordinals.push(i);
  }

  const width = document.getElementById('d3_timeline').scrollWidth;
  const height = 100;

  const svg = d3.select('#d3_timeline')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 120)
    .append('g');

  // x maps year to pixels
  const x = d3.scaleLinear()
    .domain([startYear, endYear])
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
    .attr('class', 'bar')
    .attr('x', (d, i) => xBand(i))
    .attr('y', (d) => yScale(d.value))
    .attr('width', xBand.bandwidth())
    .attr('height', (d) => height - yScale(d.value))
    // .attr('fill', '#0ff')
  ;

  const brush = d3.brushX()
    .extent([[marginLeft, 0], [width, height]])
    .on('end', brushended)
    .handleSize(24);

  const brushElm = bg.append('g')
    .attr('class', 'brush')
    .call(brush);

  function zoomed() {
    const t = d3.event.transform;
    // t.k is scale factor, t.x is translation

    // transform x axis
    xAxis.call(setXAxis(t.rescaleX(xScale)));

    // update bars
    currentX = t.rescaleX(x);
    const xBandTransformed = xBand.domain(d3.range(0, data.length / t.k));
    bars.attr('x', (d) => currentX(d.year) - (xBandTransformed.bandwidth() / 2))
        .attr('width', xBandTransformed.bandwidth())
    ;

    // update brush, detect if zoomed in past current bounds
    const minimumYear = currentX.invert(marginLeft);
    const maximumYear = currentX.invert(width);
    if (hasBrushed) {
      brushElm.call(brush.move, [
        brushRange[0] < minimumYear ? minimumYear : brushRange[0],
        brushRange[1] > maximumYear ? maximumYear : brushRange[1],
      ].map(currentX));
    }
  }

  function brushended() {
    hasBrushed = true;
    if (d3.event.selection) {
      const years = d3.event.selection.map(currentX.invert);
      if (brushRange[0] !== years[0] || brushRange[1] !== years[1]) { // changed
        brushRange = years.map(Math.round);
        callback(brushRange[0], brushRange[1]);
        brushElm.call(brush.move, brushRange.map(currentX));
      }
    } else { // happens when you drag the left and right end of brush on top of eachother
      hasBrushed = false;
      callback(startYear, endYear);
    }
  }
};
