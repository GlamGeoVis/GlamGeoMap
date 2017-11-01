import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { setViewport } from '../containers/LeafletMap/actions';
import './leaflet.css';
import CustomMarker from './CustomMarker';

window.L = leaflet;

/* eslint-disable react/no-array-index-key */

export default class LeafletMap extends React.Component {
  componentDidMount() {
    this.onViewportChanged();
  }

  onViewportChanged = () => {
    const bounds = this.leaflet.getBounds();
    // eslint-disable-next-line
    this.props.dispatch(setViewport(bounds._northEast, bounds._southWest));
  };

  invalidateSize() {
    this.leaflet.invalidateSize();
  }

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
        {this.props.data && this.props.data.map((data, idx) => (
          <CustomMarker key={idx} position={[data.lat, data.lng]}>
            <div style={{ backgroundColor: 'red' }}>
              { data.count }
            </div>
          </CustomMarker>
          ))}
      </Map>
    );
  }
}

// LeafletMap.defaultProps = {
//   position: 1,
// };

LeafletMap.propTypes = {
  style: PropTypes.object,
  dispatch: PropTypes.func,
  data: PropTypes.array,
};
