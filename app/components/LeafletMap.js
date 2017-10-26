import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

export default class LeafletMap extends React.PureComponent {
  invalidateSize() {
    this.leaflet.invalidateSize();
  }
  position = [51.505, -0.09];
  zoom = 5;

  render() {
    return (
      <Map
        ref={(elm) => {
          if (elm) this.leaflet = elm.leafletElement;
        }}
        center={this.position}
        zoom={this.zoom}
        style={{ ...this.props.style }}
      >
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={this.position}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    );
  }
}

// LeafletMap.defaultProps = {
//   position: 1,
// };

LeafletMap.propTypes = {
  style: PropTypes.object,
};
