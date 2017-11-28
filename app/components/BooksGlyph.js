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

    let glyph = (
      <GlyphContainer size={this.props.size}>
        <svg viewBox={`0,0,${this.booksPerSide},${this.booksPerSide}`} style={{ width: '100%', height: '100%' }}>
          <g>
            { rects }
          </g>
        </svg>
      </GlyphContainer>
    );

    const addBorder = (content, distance, thickness, outer = false) => (
      <BorderContainer distance={distance} thickness={thickness} outer={outer}>
        {content}
      </BorderContainer>
    );

    if (!this.props.borders) {
      glyph = addBorder(glyph, 2, 2, true);
    }

    if (this.props.borders === 1) {
      glyph = addBorder(glyph, 2, 4, true);
    }

    if (this.props.borders === 2) {
      glyph = addBorder(glyph, 2, 4, false);
      glyph = addBorder(glyph, 10, 4, true);
    }

    return glyph;
  }
}

BooksGlyph.propTypes = {
  data: PropTypes.object,
  size: PropTypes.number,
  borders: PropTypes.number,
};

const GlyphContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid black;
  border-radius: 20%;
  box-shadow: ${(props) => `${props.size / 10}px ${props.size / 10}px ${props.size / 2}px black`};
  overflow: hidden;
  position: relative;
`;

const BorderContainer = styled.div`
  display: block;
  height: 100%;
  width: 100%;
  box-sizing: content-box;
  position: relative;
  top: -${(props) => props.distance + props.thickness}px;
  left: -${(props) => props.distance + props.thickness}px;
  padding: ${(props) => props.distance}px;
  border: ${(props) => props.thickness}px solid black;
  border-radius: 20%;
  opacity: ${(props) => props.outer ? 0.8 : 1};
`;
