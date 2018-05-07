import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map, TileLayer } from 'react-leaflet';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';

import { setViewport } from '../../redux/LeafletMap/actions';
import { getClusterDetails } from '../../redux/App/actions';

import DivIcon from '../DivIcon';
import BooksGlyph from '../BooksGlyph';
import PieChartGlyph from '../PieChartGlyph';

import './leaflet.css';
import Scaler from '../../containers/Scaler';
import SquareGlyph from '../SquareGlyph';

/* eslint-disable react/no-array-index-key */
const getLeaves = (node) => !node.c ? [node] : node.c.reduce((acc, cur) => acc.concat(getLeaves(cur)), []);

const getGlyphs = (glyph, scale) => {
  if (glyph.a < scale || !glyph.c) {
    return [glyph];
  }
  else {
    return glyph.c.reduce((acc, cur) => acc.concat(getGlyphs(cur, scale)), []);
  }
};

const scaleScale = (val, max) => (val / 100) * max;


const aggregateGlyph = (node, leavesData) => {
  const leaves = getLeaves(node);
  const result = leaves.reduce((acc, cur) => {
    const leafData = leavesData.find((leaf) => leaf[4] === cur.i);
    acc.lat += leafData[0];
    acc.lng += leafData[1];
    acc.count += leafData[2];
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
    this.state = { zoom: 5, glyph: 'square' };
  }

  componentDidMount() {
    this.onViewportChanged();
  }
  shouldComponentUpdate(newProps, newState) {
    return newProps.clusters !== this.props.clusters || this.state !== newState || this.props.scale !== newProps.scale;
  }

  onViewportChanged = () => {
    if (this.state.zoom !== this.leaflet.getZoom()) {
      this.setState({ zoom: this.leaflet.getZoom() });
      console.log(`zoom: ${this.leaflet.getZoom()}`);
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
        <GlyphMenuItem onClick={this.setGlyphType('square')}>
          <div><SquareGlyph data={this.iconData} size={18} noTooltip /></div>
          Square
        </GlyphMenuItem>
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
    let glyphs = [];
    if (this.props.clusters && this.props.clusters.c) {
      glyphs = getGlyphs(this.props.clusters, scaleScale(this.props.scale, this.props.clusters.a)).map((glyph) => aggregateGlyph(glyph, this.props.leafs));
    }
    // console.log(glyphs.length + ' Glyphs drawing');
    let Glyph = SquareGlyph;
    if (this.state.glyph === 'piechart') {
      Glyph = PieChartGlyph;
    }
    if (this.state.glyph === 'glam') {
      Glyph = BooksGlyph;
    }

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
            // let size = scaleLinear(data.count, 10, this.getScaleFactor());
            // let borders = 0;
            // if (data.count / this.props.dataSet.rows > 0.1) {
            //   borders = 2;
            //   size = Math.round(size * 0.5);
            // }
            const size = 0.06 * (2**this.state.zoom) * this.props.scale * Math.sqrt(data.count);
            const key = this.state.glyph + size +  this.props.filterHash + data.lat + data.lng;
            return (
              <DivIcon iconSize={[size, size]} key={idx} position={[data.lat, data.lng]}>
                <Glyph borders={1} size={size} onClick={() => this.onGlyphClick(idx)} id={idx} data={data} />
              </DivIcon>
            );
          })}
        </Map>
        <TopRight>
          {this.glyphMenu()}
        </TopRight>
        <Top>
          <Scaler />
        </Top>
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
  clusters: PropTypes.object,
  // total: PropTypes.number,
  filterHash: PropTypes.string,
  dataSet: PropTypes.object,
};


const Top = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0 auto;
  width: 50%;
  z-index: 1000;
`;

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
