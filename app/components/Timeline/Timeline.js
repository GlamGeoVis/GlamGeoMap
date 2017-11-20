/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styled from 'styled-components';
import { setTimeRange } from '../../containers/Timeline/actions';
import { colorForYear, rgbString } from '../../utils/colors';

export default class Timeline extends React.Component {
  componentDidMount() {
    const initD3 = () => {
      const oldD3 = this.d3;
      this.d3 = new D3Timeline(
        this.props.minYear,
        this.props.maxYear,
        this.setSelectionValues
      );
      this.d3.zoomOut();
      if (oldD3 && oldD3.hasBrushed) {
        this.d3.setBrush(oldD3.brushRange[0], oldD3.brushRange[1]);
      }
    };

    window.addEventListener('resize', initD3);
    initD3();
  }

  componentWillReceiveProps(newProps) {
    const data = [];
    for (let i = this.props.minYear; i < this.props.maxYear; i += 1) {
      data.push({
        year: i,
        value: newProps.years[i] || 0,
      });
    }
    this.d3.setData(data);
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
  // eslint-disable-next-line react/no-unused-prop-types
  years: PropTypes.object,
};

const marginLeft = 20;

class D3Timeline {
  constructor(startYear, endYear, callback) {
    document.getElementById('d3_timeline').innerHTML = '';
    this.startYear = startYear;                                       // minimum year for timeline
    this.endYear = endYear;                                           // maximum year for timeline
    this.callback = callback;                                         // callback on brush sets range
    this.hasBrushed = false;                                          // is the brush active?
    this.brushRange = [startYear, endYear];                           // brush position
    this.width = document.getElementById('d3_timeline').scrollWidth;  // width of element in pixels
    this.height = 100;                                                // height of element in pixels

    this.x = d3.scaleLinear()                                         // x maps year to pixels
      .domain([this.startYear, this.endYear])
      .range([marginLeft, this.width]);
    this.currentX = this.x.copy();

    this.xBand = d3.scaleBand()                                       // for the year bins (maps index to
                                                                          // pixels (discrete), has bandWidth)
      .domain(d3.range(0, this.endYear - this.startYear))
      .range([marginLeft, this.width])
      .paddingInner(0.1)
    ;
    this.currentXBand = this.xBand.copy();
    this.init();
  }

  zoomOut() {
    this.zoom.scaleTo(this.bg, 1);
  }

  setXValues() {
    this.bars
      .selectAll('.bar')
      .attr('x', (d) => this.currentX(d.year) - (this.currentXBand.bandwidth() / 2))
      .attr('width', this.currentXBand.bandwidth())
    ;
  }

  setData(data) {
    // maps Y value to height (inverse, large height means small bar)
    const maxY = d3.max(data, (d) => d.value);
    const yScale = d3.scaleLinear().range([this.height, 0]).domain([0, maxY]);
    // don't put ticks on sub integer values
    const axis = d3.axisLeft(yScale).ticks(maxY > 5 ? 5 : maxY);
    this.yAxis.call(axis);

    this.bars.selectAll('.bar')
      .data(data)
      .transition()
      .duration(500)
      .attr('height', (d) => this.height - yScale(d.value))
      .attr('y', (d) => yScale(d.value))
      .attr('fill', (d) => rgbString(colorForYear(d.year)));
  }

  brushended = (self = this) => () => {
    if (d3.event.selection) {
      self.hasBrushed = true;
      const years = d3.event.selection.map(self.currentX.invert);
      if (self.brushRange[0] !== years[0] || self.brushRange[1] !== years[1]) { // changed
        self.brushRange = years.map(Math.round);
        self.callback(self.brushRange[0], self.brushRange[1]);
        self.brushElm.call(self.brush.move, self.brushRange.map(self.currentX));
      }
    } else { // happens when you drag the left and right end of brush on top of eachother
      self.hasBrushed = false;
      self.callback(self.startYear, self.endYear);
    }
  };

  setBrush = (leftYear, rightYear) => {
    console.log(this);
    this.brushElm.call(this.brush.move, [leftYear, rightYear].map(this.currentX));
  };
  
  zoomed = (self = this) => () => {
    // maps index to pixels
    const fullXSCale = self.x.copy().domain([0, this.endYear - this.startYear]);

    const t = d3.event.transform;
    // t.k is scale factor, t.x is translation

    // transform x axis
    self.xAxis.call(d3.axisBottom(t.rescaleX(fullXSCale)).tickFormat((d) => d + this.startYear));
    // update bars
    self.currentX = t.rescaleX(self.x);
    self.currentXBand = self.xBand.domain(d3.range(0, (self.endYear - self.startYear) / t.k));

    self.setXValues();

    // update brush, detect if zoomed in past current bounds
    if (self.hasBrushed) {
      const minimumYear = self.currentX.invert(marginLeft);
      const maximumYear = self.currentX.invert(self.width);
      self.setBrush(
        self.brushRange[0] < minimumYear ? minimumYear : self.brushRange[0],
        self.brushRange[1] > maximumYear ? maximumYear : self.brushRange[1],
      );
    }
  };

  init() {
    const svg = d3.select('#d3_timeline')
      .append('svg')
      .attr('width', '100%')
      .attr('height', 120)
      .append('g');

    this.zoom = d3.zoom()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', this.zoomed());

    // zoomable group
    this.bg = svg.append('g')
      .attr('width', this.width - marginLeft)
      .attr('x', marginLeft)
      .attr('height', this.height + 40)
      .call(this.zoom);

    // this is to catch all events for zooming
    this.bg.append('rect')
      .attr('width', this.width - marginLeft)
      .attr('x', marginLeft)
      .attr('height', this.height + 40)
      .attr('fill', 'white');

    // background colour for graph
    this.bg.append('rect')
      .attr('width', this.width - marginLeft)
      .attr('x', marginLeft)
      .attr('height', this.height)
      .attr('fill', '#333');

    // define clippath to hide overflow
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'my-clip-path')
      .append('rect')
      .attr('width', this.width - marginLeft)
      .attr('x', marginLeft)
      .attr('height', this.height);

    // y-axis
    this.yAxis = this.bg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${marginLeft},0)`);

    this.xAxis = this.bg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0, ${this.height})`);

    this.bars = this.bg.append('g')
      .attr('class', 'bars')
      .attr('clip-path', 'url(#my-clip-path)')
    ;

    this.brush = d3.brushX()
      .extent([[marginLeft, 0], [this.width, this.height]])
      .on('end', this.brushended(this))
      .handleSize(24);
    // add brush after bars
    this.brushElm = this.bg.append('g')
      .attr('class', 'brush')
      .call(this.brush);


    const data = [];
    for (let i = this.startYear; i < this.endYear; i += 1) {
      data.push({
        year: i,
        value: 0,
      });
    }
    this.bars
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar');
    this.setData(data);
  }
}
