import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './leaflet.css';
import DivIcon from './DivIcon';

export default class LeafletMap extends React.PureComponent {
  constructor() {
    super();
    this.state = { zoom: 5, glyph: 'square' };
  }

  componentDidMount() {
    const map = L.map('leaflet_root').setView([51.505, -0.09], 13);
    window.map = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const myIcon = new DivIcon({ className: 'my-div-icon' });
    L.marker([50.505, 30.57], { icon: myIcon }).addTo(map);
    const elm = myIcon._icon;
    // elm.style.height = '100px';
    // elm.style.width = '100px';
    elm.style.backgroundColor = 'blue';
    window.elm = elm;
    window.L = L;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{ ...this.props.style, position: 'relative' }}>
        <LeafletRoot id="leaflet_root" />
        <Overlay>
          <div
            style={{
              backgroundColor: 'red',
              position: 'absolute',
              width: '100px',
              height: '100px',
            }}
          />
        </Overlay>
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
  height: 100%
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
