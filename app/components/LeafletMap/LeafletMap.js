import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import DivIcon from 'react-leaflet-div-icon';
import 'leaflet/dist/leaflet.css';
import { setViewport } from '../../containers/LeafletMap/actions';
import './leaflet.css';
import PieChartGlyph from '../PieChartGlyph';
import { getClusterDetails } from '../../containers/App/actions';

/* eslint-disable react/no-array-index-key */

export default class LeafletMap extends React.PureComponent {
  componentDidMount() {
    this.onViewportChanged();
  }
  shouldComponentUpdate(newProps) {
    return newProps.data !== this.props.data;
  }

  onViewportChanged = () => {
    const bounds = this.leaflet.getBounds();
    // eslint-disable-next-line
    this.props.dispatch(setViewport(bounds._northEast, bounds._southWest));
  };

  onGlyphClick = (id) => {
    this.props.dispatch(getClusterDetails(id));
  }

  invalidateSize = () => {
    this.leaflet.invalidateSize();
  };

  position = [51.505, -0.09];
  zoom = 5;

  render() {
    return (
      <Map
        ref={(elm) => {
          if (elm) {
            this.leaflet = elm.leafletElement;
          }
        }}
        center={this.position}
        zoom={this.zoom}
        style={{ ...this.props.style }}
        onViewportChanged={this.onViewportChanged}
      >
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {this.props.data && this.props.data.map((data, idx) => {
          const size = dampen(data.count, 20, 100, this.props.total / 10);
          return (
            <DivIcon iconSize={[size, size]} key={idx} position={[data.lat, data.lng]}>
              <PieChartGlyph onClick={() => this.onGlyphClick(idx)} id={idx} count={data.count} data={data} />
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
};
