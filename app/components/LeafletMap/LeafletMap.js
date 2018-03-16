import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css';
import Glyphs from '../../containers/LeafletMap/Glyphs';
import Scaler from '../../containers/Scaler';

export default class LeafletMap extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      zoom: 5,
      glyph: 'square',
    };
  }

  componentDidMount() {
    this.map = L.map('leaflet_root').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    this.forceUpdate();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{ ...this.props.style, position: 'relative' }}>
        <LeafletRoot id="leaflet_root" />
        <Overlay>
          <Top>
            <Scaler />
          </Top>
        </Overlay>
        { this.map && <Glyphs map={this.map} /> }
      </div>
    );
  }
}

LeafletMap.propTypes = {
  style: PropTypes.object,
  // dispatch: PropTypes.func,
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
  left: 50vh;
  transform: translate(-50%, 0);
  margin: 0 auto;
  width: 50vh;
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
