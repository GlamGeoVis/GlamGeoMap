import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default class LeafletMap extends React.PureComponent {
  invalidateSize() {
    this.leaflet.invalidateSize();
  }

  render() {
    return (
      <Map
        ref={(elm) => {
          if (elm) this.leaflet = elm.leafletElement;
        }}
        center={this.props.position}
        zoom={5}
        style={{ ...this.props.style }}
      >
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={this.props.position}>
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
  position: PropTypes.array,
  style: PropTypes.object,
};
