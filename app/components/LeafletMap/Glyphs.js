import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import * as ReactDOM from 'react-dom';
import DivIcon from './DivIcon';
import SquareGlyph from '../SquareGlyph';

export default class Glyphs extends React.Component {
  static propTypes = {
// eslint-disable-next-line react/no-unused-prop-types
    glyphs: PropTypes.arrayOf(PropTypes.object),
    map: PropTypes.object,
  };

  constructor() {
    super();
    this.glyphs = [];
  }

  componentDidMount() {
    this.group = L.layerGroup().addTo(this.props.map);
  }

  componentWillReceiveProps(newProps) {
    console.log(`rendering ${newProps.glyphs.length} glyphs`);
    console.time('render glyphs');
    // this.group.clearLayers();

    const newIdxs = newProps.glyphs.map((ng) => ng.idx);
    const markerPane = document.getElementsByClassName('leaflet-marker-pane')[0];
    this.glyphs.forEach((g, idx) => {
      if (g && !newIdxs.includes(idx)) {
        // this.props.map.removeLayer(g.leafletElm);
        // markerPane.removeChild(g.htmlElm);
        g.htmlElm.style.display = 'none';
        this.glyphs[idx] = null;
      }
    });

    newProps.glyphs.forEach((glyph) => {
      const previousGlyph = this.glyphs[glyph.idx];
      if (previousGlyph) {
        console.log('should update');
        previousGlyph.htmlElm.style.display = 'block';
      } else {
        const myIcon = new DivIcon({ className: 'my-div-icon' });
        this.group.addLayer(L.marker([glyph.data.lat, glyph.data.lng], { icon: myIcon }));
        const elm = myIcon.icon;
        elm.innerHTML = `
          <div style="width: ${Math.min(50, glyph.data.count)}px; height: ${Math.min(50, glyph.data.count)}px; background-color: red" /> 
        `;
        this.glyphs[glyph.idx] = {
          leafletElm: myIcon,
          htmlElm: elm,
        };
      }
      // const reactElm = <SquareGlyph glyph={glyph} />;
      // ReactDOM.render(reactElm, elm);
    });
    console.log(this.glyphs.filter(g => !!g));

    console.timeEnd('render glyphs');
  }

  render() {
    return null;
  }
}
