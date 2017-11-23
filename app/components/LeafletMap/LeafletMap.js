import React from 'react';
import PropTypes from 'prop-types';
import ngeohash from 'ngeohash';
import styled from 'styled-components';
import { Map, TileLayer } from 'react-leaflet';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';

import { setViewport } from '../../containers/LeafletMap/actions';
import { getClusterDetails } from '../../containers/App/actions';

import DivIcon from '../DivIcon';
import BooksGlyph from '../BooksGlyph';
import PieChartGlyph from '../PieChartGlyph';

import './leaflet.css';

/* eslint-disable react/no-array-index-key */

export default class LeafletMap extends React.PureComponent {
  constructor() {
    super();
    this.state = { zoom: 5, glyph: 'piechart' };
  }

  componentDidMount() {
    this.onViewportChanged();
  }
  shouldComponentUpdate(newProps, newState) {
    return newProps.data !== this.props.data || this.state !== newState;
  }

  onViewportChanged = () => {
    this.setState({ zoom: this.leaflet.getZoom() });
    const bounds = this.leaflet.getBounds();
    // eslint-disable-next-line
    this.props.dispatch(setViewport(bounds._northEast, bounds._southWest));
  };

  onGlyphClick = (id) => {
    this.props.dispatch(getClusterDetails(id));
  };

  setGlyphType = (glyph) => () => { this.setState({ glyph }); };

  invalidateSize = () => {
    this.leaflet.invalidateSize();
  };

  initialPosition = [51.505, -0.09];

  glyphMenu = () => (
    <GlyphMenuContainer>
      <DropdownButton bsStyle="primary" title="Glyph type" pullRight>
        <GlyphMenuItem onClick={this.setGlyphType('piechart')}>
          <div><PieChartGlyph data={dummyData} size={18} noTooltip /></div>
          Pie chart (chart.js)
        </GlyphMenuItem>
        <GlyphMenuItem onClick={this.setGlyphType('glam')}>
          <div><BooksGlyph data={dummyData} size={18} noTooltip /></div>
          GLAM glyph
        </GlyphMenuItem>
      </DropdownButton>
    </GlyphMenuContainer>
  );

  render() {
    const Glyph = this.state.glyph === 'piechart' ? PieChartGlyph : BooksGlyph;
    return (
      <div style={{ ...this.props.style, position: 'relative' }}>
        <Map
          ref={(elm) => {
            if (elm) {
              this.leaflet = elm.leafletElement;
            }
          }}
          style={{ width: '100%', height: '100%' }}
          center={this.initialPosition}
          zoom={this.state.zoom}
          onViewportChanged={this.onViewportChanged}
        >
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {this.props.data && (this.props.data).map((data, idx) => {
            const size = dampen(data.count, 20, 100, this.props.total / 10);
            const key = this.state.glyph + this.state.zoom + this.props.filterHash + ngeohash.encode(data.lat, data.lng, 4);
            return (
              <DivIcon iconSize={[size, size]} key={key} position={[data.lat, data.lng]}>
                <Glyph key={idx} size={size} onClick={() => this.onGlyphClick(idx)} id={idx} data={data} />
              </DivIcon>
            );
          })}
        </Map>
        <TopRight>
          {this.glyphMenu()}
        </TopRight>
      </div>
    );
  }
}

const dampen = (x, min, max, range) => (max / 2) * (1 / (0.5 + Math.exp(-x / range)));

LeafletMap.propTypes = {
  style: PropTypes.object,
  dispatch: PropTypes.func,
  data: PropTypes.array,
  total: PropTypes.number,
  filterHash: PropTypes.string,
};


const TopRight = styled.div`
  position: absolute;
  top: 20px;
  right: 50px;
  z-index: 1000;
`;

const dummyData = {
  count: 22,
  years: {
    1750: 2,
    1800: 10,
    1850: 8,
    1900: 2,
  },
};

const GlyphMenuContainer = styled.div`
  > div {
    > button {
      opacity: .8;
    }
    > ul {
      background-color: rgba(255,255,255,.8);
    }
  }
`;

const GlyphMenuItem = styled(MenuItem)`
  vertical-align: middle;
  >a {
    position: relative;
    display: flex !important;
    align-items: center;
    >div:first-child {
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
  }
`;
