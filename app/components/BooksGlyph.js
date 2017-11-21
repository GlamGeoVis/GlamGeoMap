import React from 'react';
import { buckets, colorForYear, rgbString } from '../utils/colors';

export default class BooksGlyph extends React.Component {
  getRect = (row, column, size) => ({
    x: column,
    y: row,
    height: column > 0 || size < this.booksPerSide ? 1 : Math.floor(size / this.booksPerSide),
    width: Math.min(size, this.booksPerSide - column),
  });

  render() {
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
            x={rect.x * this.bookSize}
            y={rect.y * this.bookSize}
            width={rect.width * this.bookSize}
            height={rect.height * this.bookSize}
            fill={colors[i]}
            stroke={colors[i]}
            strokeWidth="0.01"
          />);
      }
    }

    return (
      <div style={{ border: '2px solid black', borderRadius: `${this.props.size / 5}px`, overflow: 'hidden' }}>
      <svg viewBox="0,0,1,1" style={{width: '100%', height: '100%'}}>
        <g>
          { rects }
        </g>
      </svg>
      </div>
    );
  }
}