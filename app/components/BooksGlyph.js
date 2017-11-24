import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { buckets, colorForYear, rgbString } from '../utils/colors';

export default class BooksGlyph extends React.Component {
  getRect = (row, column, size) => ({
    x: column,
    y: row,
    height: column > 0 || size < this.booksPerSide ? 1 : Math.floor(size / this.booksPerSide),
    width: Math.min(size, this.booksPerSide - column),
  });

  render() {
    if (!this.props.data) { return null; }
    this.booksPerSide = Math.ceil(Math.sqrt(this.props.data.count));
    this.bookSize = 1 / this.booksPerSide;
    const nRest = (this.booksPerSide * this.booksPerSide) - this.props.data.count;

    const colors = ['#000', ...buckets.map((year) => rgbString(colorForYear(year)))];
    const booksPerBucket = [nRest, ...Object.values(this.props.data.years)];

    let currentRow = 0;
    let currentColumn = 0;
    const rects = [];
    for (let i = 0; i < colors.length; i += 1) {
      let booksLeft = booksPerBucket[i];
      while (booksLeft) {
        const rect = this.getRect(currentRow, currentColumn, booksLeft);
        booksLeft -= rect.width * rect.height;
        currentColumn = (currentColumn + rect.width) % this.booksPerSide;
        if (currentColumn === 0) {
          currentRow += rect.height;
        }
        rects.push(
          <rect
            key={rects.length}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={colors[i]}
            stroke={colors[i]}
            strokeWidth="0.2"
          />);
      }
    }

    return (
      <Glyph size={this.props.size}>
        <svg viewBox={`0,0,${this.booksPerSide},${this.booksPerSide}`} style={{ width: '100%', height: '100%' }}>
          <g>
            { rects }
          </g>
        </svg>
      </Glyph>
    );
  }
}

BooksGlyph.propTypes = {
  data: PropTypes.object,
  size: PropTypes.number,
};

const Glyph = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid black;
  border-radius: ${(props) => props.size / 5}px;
  box-shadow: ${(props) => ((s) => `${s / 10}px ${s / 10}px ${s / 2}px black`)(props.size)};
  overflow: hidden;
  opacity: .6;
`;
