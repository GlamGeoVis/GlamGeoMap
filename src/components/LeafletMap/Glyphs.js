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

  zoom = () => {
    console.log('zoom called');
  };

  componentWillReceiveProps(newProps) {
    console.log(`rendering ${newProps.glyphs.length} glyphs`, newProps);
    console.time('render glyphs');
    if (newProps.glyphs === this.props.glyphs && newProps.mapBounds === this.props.mapBounds) { return; }
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
      const size = Math.sqrt((2 ** this.props.zoomLevel) * glyph.data.count) / 5;
      if (previousGlyph) {
        previousGlyph.glyphContainer.style.width = `${size}px`;
        previousGlyph.glyphContainer.style.height = `${size}px`;
      } else {
        const myIcon = new DivIcon({ className: 'my-div-icon', iconSize: [1,1] });
        this.group.addLayer(L.marker([glyph.data.lat, glyph.data.lng], { icon: myIcon }));
        const elm = myIcon.icon;
        elm.innerHTML = `
            <div style="padding: 2px; border: 1px solid black; display: inline-block;">
                <div style="width: ${size}px; height: ${size}px; transition: width .25s, height .25s">
                    <div style="background-color: red; width: 100%; height: 100%"/>
                </div>
            </div> 
        `;
        this.glyphs[glyph.idx] = {
          leafletElm: myIcon,
          htmlElm: elm,
          borderDiv: elm.firstElementChild,
          glyphContainer: elm.firstElementChild.firstElementChild,
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
