import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class SquareGlyph extends React.Component {

  render() {
    if (!this.props.data) { return null; }
    let glyph = (
      <GlyphContainer
        size={this.props.size}
        onClick={() => this.props.onClick && this.props.onClick(this.props.id)}
      >
      </GlyphContainer>
    );

    return glyph;
  }
}

SquareGlyph.propTypes = {
  data: PropTypes.object,
  size: PropTypes.number,
  borders: PropTypes.number,
  onClick: PropTypes.func,
  id: PropTypes.number,
};

const GlyphContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: red;
  position: relative;
`;

