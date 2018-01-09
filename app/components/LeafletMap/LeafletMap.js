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

const getLeaves = (node) => Number.isInteger(node) ? [node] : node.reduce((acc, cur) => acc.concat(getLeaves(cur)), []);
const getGlyphs = (node, zoomLevel, depth = 0) =>
  (depth >= zoomLevel)
    ? node
    : node.reduce(
    (acc, cur) => acc.concat(Number.isInteger(cur) ? [cur] : getGlyphs(cur, zoomLevel, depth + 1))
    , []);

const aggregateGlyph = (node, leavesData) => {
  const leaves = getLeaves(node);
  const result = leaves.reduce((acc, cur) => {
    const leafData = leavesData.find((leaf) => leaf[4] === cur);
    acc.lat += leafData[0];
    acc.lng += leafData[1];
    acc.count += 1;
    acc.years = acc.years.map((a, i) => a + leafData[3][i]);
    return acc;
  }, {
    lat: 0,
    lng: 0,
    count: 0,
    years: [0, 0, 0, 0, 0, 0],
  });
  result.lat /= leaves.length;
  result.lng /= leaves.length;
  return result;
};


export default class LeafletMap extends React.PureComponent {
  constructor() {
    super();
    this.state = { zoom: 5, glyph: 'piechart' };
  }

  componentDidMount() {
    this.onViewportChanged();
  }
  shouldComponentUpdate(newProps, newState) {
    return newProps.clusters !== this.props.clusters || this.state !== newState;
  }

  onViewportChanged = () => {
    if (this.state.zoom !== this.leaflet.getZoom()) {
      this.setState({ zoom: this.leaflet.getZoom() });
    }
    const bounds = this.leaflet.getBounds();
    // eslint-disable-next-line
    this.props.dispatch(setViewport(bounds._northEast, bounds._southWest));
  };

  onGlyphClick = (id) => {
    this.props.dispatch(getClusterDetails(id));
  };

  setGlyphType = (glyph) => () => { this.setState({ glyph }); };

  getScaleFactor = () => {
    const magicScaleFactor = this.props.dataSet.name === 'risse' ? 2000 : 5000;
    return (magicScaleFactor / this.props.dataSet.rows) * this.state.zoom * this.state.zoom;
  };

  glyphMenu = () => (
    <GlyphMenuContainer>
      <DropdownButton id="glyphSelector" bsStyle="primary" title="Glyph type" pullRight>
        <GlyphMenuItem onClick={this.setGlyphType('piechart')}>
          <div><PieChartGlyph data={this.iconData} size={18} noTooltip /></div>
          Pie chart (chart.js)
        </GlyphMenuItem>
        <GlyphMenuItem onClick={this.setGlyphType('glam')}>
          <div><BooksGlyph data={this.iconData} size={18} noTooltip /></div>
          GLAM glyph
        </GlyphMenuItem>
      </DropdownButton>
    </GlyphMenuContainer>
  );

  initialPosition = [51.505, -0.09];
  iconData = {
    count: 22,
    years: {
      1750: 2,
      1800: 10,
      1850: 8,
      1900: 2,
    },
  };

  invalidateSize = () => {
    this.leaflet.invalidateSize();
  };

  render() {
    console.log('rendering LeafletMap');
    const glyphs = getGlyphs(this.props.clusters, this.state.zoom).map((glyph) => aggregateGlyph(glyph, this.props.leafs));

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
            noWrap
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {glyphs && glyphs.map((data, idx) => {
            // const size = scaleDampen(data.count, 20, 100, this.props.total / 10);
            let size = scaleLinear(data.count, 10, this.getScaleFactor());
            let borders = 0;
            if (data.count / this.props.dataSet.rows > 0.1) {
              borders = 2;
              size = Math.round(size * 0.5);
            }
            const key = this.state.glyph + size + this.props.filterHash + ngeohash.encode(data.lat, data.lng, 4);
            return (
              <DivIcon iconSize={[size, size]} key={key} position={[data.lat, data.lng]}>
                <Glyph borders={borders} size={size} onClick={() => this.onGlyphClick(idx)} id={idx} data={data} />
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

// const scaleDampen = (x, min, max, range) => Math.round((max / 2) * (1 / (0.5 + Math.exp(-x / range))));
const scaleLinear = (x, min, scaleFactor) => Math.max(min, Math.sqrt(Math.round(x * scaleFactor)));


LeafletMap.propTypes = {
  style: PropTypes.object,
  dispatch: PropTypes.func,
  leafs: PropTypes.array,
  clusters: PropTypes.array,
  // total: PropTypes.number,
  filterHash: PropTypes.string,
  dataSet: PropTypes.object,
};


const TopRight = styled.div`
  position: absolute;
  top: 20px;
  right: 50px;
  z-index: 1000;
`;

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
