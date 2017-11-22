import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import ngeohash from 'ngeohash';
import 'leaflet/dist/leaflet.css';
import DivIcon from '../DivIcon';
import { setViewport } from '../../containers/LeafletMap/actions';
import './leaflet.css';
// import PieChartGlyph from '../PieChartGlyph';
import { getClusterDetails } from '../../containers/App/actions';
import BooksGlyph from '../BooksGlyph';
// import BooksGlyph from '../BooksGlyph';

/* eslint-disable react/no-array-index-key */

export default class LeafletMap extends React.PureComponent {
  constructor() {
    super();
    this.state = { zoom: 5 };
  }
  componentDidMount() {
    this.onViewportChanged();
  }
  shouldComponentUpdate(newProps) {
    return newProps.data !== this.props.data;
  }

  onViewportChanged = () => {
    this.setState({ zoom: this.leaflet.getZoom() });
    console.log('zoom', this.leaflet.getZoom());
    const bounds = this.leaflet.getBounds();
    // eslint-disable-next-line
    this.props.dispatch(setViewport(bounds._northEast, bounds._southWest));
  };

  onGlyphClick = (id) => {
    this.props.dispatch(getClusterDetails(id));
  };

  invalidateSize = () => {
    this.leaflet.invalidateSize();
  };

  position = [51.505, -0.09];

  render() {
    return (
      <Map
        ref={(elm) => {
          if (elm) {
            this.leaflet = elm.leafletElement;
          }
        }}
        center={this.position}
        zoom={this.state.zoom}
        style={{ ...this.props.style }}
        onViewportChanged={this.onViewportChanged}
      >
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {this.props.data && (this.props.data).map((data, idx) => {
          const size = dampen(data.count, 20, 100, this.props.total / 10);
          const key = this.state.zoom + this.props.filterHash + ngeohash.encode(data.lat, data.lng, 4);
          return (
            <DivIcon iconSize={[size, size]} key={key} position={[data.lat, data.lng]}>
              <BooksGlyph key={idx} size={size} onClick={() => this.onGlyphClick(idx)} id={idx} count={data.count} data={data} />
            </DivIcon>
          );
        })}
      </Map>
    );
  }
}

const dampen = (x, min, max, range) => (max / 2) * (1 / (0.5 + Math.exp(-x / range)));

// LeafletMap.defaultProps = {
//   position: 1,
// };

LeafletMap.propTypes = {
  style: PropTypes.object,
  dispatch: PropTypes.func,
  data: PropTypes.array,
  total: PropTypes.number,
  filterHash: PropTypes.string,
};
