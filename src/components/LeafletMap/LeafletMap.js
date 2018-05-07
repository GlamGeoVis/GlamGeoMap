import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css';
import Glyphs from '../../containers/LeafletMap/Glyphs';
import Scaler from '../../containers/Scaler';
import { setZoomLevel } from '../../redux/LeafletMap/actions';

export default class LeafletMap extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      zoom: 5,
      glyph: 'square',
      mapBounds: {
        x: {
          min: 0,
          max: 0,
        },
        y: {
          min: 0,
          max: 0,
        },
      },
    };
  }

  componentDidMount() {
    window.L = L;
    this.map = L.map('leaflet_root', {
      inertia: false,
      maxZoom: 15,
    }).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(this.map);
    window.map = this.map;
    this.setMapBounds();
    this.map.on('moveend', this.setMapBounds);
    this.map.on('zoomanim', (e) => {
      this.glyphs.wrappedInstance.zoom(e.target._animateToZoom - e.target.getZoom());
    });
    this.map.on('zoomend', (e) => {
      this.setMapBounds();
      this.props.dispatch(setZoomLevel(e.target.getZoom()));
    });
  }

  setMapBounds = () => {
    const bounds = this.map.getBounds();
    const ne = L.Projection.SphericalMercator.project(bounds._northEast);
    const sw = L.Projection.SphericalMercator.project(bounds._southWest);
    this.setState({
      mapBounds: {
        x: {
          min: sw.x,
          max: ne.x,
        },
        y: {
          min: sw.y,
          max: ne.y,
        },
      },
    });
  };

  render() {
    return (
      <div style={{ ...this.props.style, position: 'relative' }}>
        <LeafletRoot id="leaflet_root" />
        <Overlay>
          <Top>
            <Scaler />
          </Top>
        </Overlay>
        { this.map && <Glyphs ref={(g) => { this.glyphs = g; }} mapBounds={this.state.mapBounds} map={this.map} /> }
      </div>
    );
  }
}

LeafletMap.propTypes = {
  style: PropTypes.object,
  dispatch: PropTypes.func,
  // leafs: PropTypes.array,
  // clusters: PropTypes.object,
  // total: PropTypes.number,
  // filterHash: PropTypes.string,
  // dataSet: PropTypes.object,
};

const LeafletRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top:0;
  left:0;
  width: 0;
  height: 0;
  z-index: 1000;
`;


const Top = styled.div`
  position: absolute;
  top: 20px;
  left: 50vw;
  transform: translate(-50%, 0);
  margin: 0 auto;
  width: 50vw;
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
