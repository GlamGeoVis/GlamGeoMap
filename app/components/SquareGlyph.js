import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SquareGlyph = ({ glyph }) => <GlyphContainer count={glyph.count} />;
SquareGlyph.propTypes = {
  glyph: PropTypes.object,
};
export default SquareGlyph;

const GlyphContainer = styled.div`
  width: ${(props) => Math.min(50, props.count)}px;
  height: ${(props) => Math.min(50, props.count)}px;
  background-color: red;
  position: relative;
`;

