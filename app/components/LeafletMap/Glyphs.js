import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import * as ReactDOM from 'react-dom';
import DivIcon from './DivIcon';
import SquareGlyph from '../SquareGlyph';

const propTypeMinMax = PropTypes.shape({
  min: PropTypes.number,
  max: PropTypes.number,
});

export default class Glyphs extends React.Component {
  static propTypes = {
// eslint-disable-next-line react/no-unused-prop-types
    glyphs: PropTypes.arrayOf(PropTypes.object),
    map: PropTypes.object, // leaflet map
// eslint-disable-next-line react/no-unused-prop-types
    mapBounds: PropTypes.shape({
      x: propTypeMinMax,
      y: propTypeMinMax,
    }),
    zoomLevel: PropTypes.number,
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

    const bounds = newProps.mapBounds;
    const filteredGlyphs = newProps.glyphs
      .filter((glyph) =>
        glyph.data.x < bounds.x.max &&
        glyph.data.x > bounds.x.min &&
        glyph.data.y < bounds.y.max &&
        glyph.data.y > bounds.y.min
      );

    console.log(`${filteredGlyphs.length} within view bounds`);

    const markerPane = document.getElementsByClassName('leaflet-marker-pane')[0];
    const newIdxs = filteredGlyphs.map((ng) => ng.idx);
    this.glyphs.forEach((g, idx) => {
      if (g && !newIdxs.includes(idx)) {
        this.props.map.removeLayer(g.leafletElm);
        markerPane.removeChild(g.htmlElm);
        // g.htmlElm.style.display = 'none';
        this.glyphs[idx] = null;
      }
    });

    filteredGlyphs.forEach((glyph) => {
      const previousGlyph = this.glyphs[glyph.idx];
      if (previousGlyph) {
        console.log('should update');
        previousGlyph.htmlElm.style.display = 'block';
      } else {
        const myIcon = new DivIcon({ className: 'my-div-icon' });
        this.group.addLayer(L.marker([glyph.data.lat, glyph.data.lng], { icon: myIcon }));
        const elm = myIcon.icon;
        const size = Math.sqrt((2 ** this.props.zoomLevel) * glyph.data.count) / 10;
        elm.innerHTML = `
          <div style="width: ${size}px; height: ${Math.min(size)}px; background-color: red; padding: 2px; border: 1px solid black"/> 
        `;
        this.glyphs[glyph.idx] = {
          leafletElm: myIcon,
          htmlElm: elm,
        };
      }
      // const reactElm = <SquareGlyph glyph={glyph} />;
      // ReactDOM.render(reactElm, elm);
    });

    console.timeEnd('render glyphs');
  }

  render() {
    return null;
  }
}
