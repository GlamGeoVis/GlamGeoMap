// import React from 'react';
// import * as d3 from 'd3';
//
// export default class BooksGlyph extends React.Component {
//   componentDidMount() {
//     this.g = d3.select(this.elm)
//       .append('svg').append('g');
//     books(this.g, { children: [ {size: 4}, {size: 5} ] }, 100);
//   }
//   render() {
//     return <div ref={(elm) => { this.elm = elm; }}>test</div>;
//   }
// }
//
// const appendPoly = (g, pts) => {
//   const path = d3.line().curve(d3.curveLinear);
//   console.log('pts', pts);
//   if (Number.isNaN(pts[0][0])) { throw 'nan'; }
//   return g.append('path').datum(pts).attr('d', (d) => console.log(path(d)) || path(d) + 'Z');
// };
//
// console.log(d3);
//
// const appendRect = (g, x, width = null, y = null, height = null) => {
//   if (y === null) {
//     y = x;
//   }
//   if (width == null) {
//     width = x < 0 ? -2 * x : x;
//   }
//
//   if (height == null) {
//     height = width;
//   }
//   g.append('rect')
//     .attr('x', x)
//     .attr('y', y)
//     .attr('width', width)
//     .attr('height', height);
//
//   return g;
// };
//
// function books(g, datum, radius, inverted, combinationStyle, filterFunction) {
//   var blockHeight, bookOffsetY, bookSize, booksPerSide, borderSize, child, col, curCount, el, firstLine, hasFilters, j, lastLine, leftAfterFirstLine, len, nth, numChildren, numLevels, prefs, ref, sum, zs;
//   if (inverted == null) {
//     inverted = false;
//   }
//   if (combinationStyle == null) {
//     combinationStyle = null;
//   }
//   if (filterFunction == null) {
//     filterFunction = null;
//   }
//   // prefs = window.GlottoVis.preferences;
//
//   // numLevels = Object.keys(prefs.dataset.allowedGlyphs[prefs.glyph].rings).length;
//   numLevels = 10;
//
//   // hasFilters = filterFunction != null;
//   // if (filterFunction != null) {
//   //   let datum = filterDatum(datum, filterFunction, {
//   //     inverted: inverted,
//   //     comStyle: combinationStyle
//   //   });
//   // }
//   // borderSize = prefs.clusterItemBorder;
//   borderSize = 10;
//
//   appendRect(g, -radius - borderSize).classed('glyph-shadow', true);
//   el = appendPoly(g,
//     [[-radius - borderSize, -radius - borderSize],
//       [radius + borderSize, -radius - borderSize],
//       [radius + borderSize, radius + borderSize],
//       [-radius - borderSize, radius + borderSize],
//       [-radius, radius],
//       [radius, radius],
//       [radius, -radius],
//       [-radius, -radius]]).style('fill', '#fff');
//   nth = 0;
//   el.attr('d', el.attr('d').substr(0, el.attr('d').length - 1).replace(/L/g, function(m, i, o) {
//     if (++nth === 4) {
//       return 'M';
//     } else {
//       return m;
//     }
//   }));
//   appendRect(g, -radius - borderSize).classed('glyph-bg', true).style('stroke', '#333').style('stroke-width', 2);
//   appendRect(g, -radius).classed('glyph-bg', true).style('stroke', '#333').style('stroke-width', 2);
//
//   numChildren = datum.children.length;
//   if (numChildren === 0 || (datum.children[0].size == null)) {
//     return;
//   }
//   curCount = 0;
//   // zs = window.GlottoVis.getZoomScale();
//   zs = 1;
//   if (zs < 0) {
//     sum = datum.children.reduce(function(p, c) {
//       return p + c.size;
//     }, 0);
//     bookSize = 2 * radius / Math.ceil(Math.sqrt(sum));
//   } else {
//     // bookSize = prefs.clusterItemSize * 256 * zs;
//     bookSize = 3 * 256 * zs;
//   }
//   booksPerSide = Math.round(radius * 2 / bookSize) || 2;
//   ref = datum.children;
//   for (col = j = 0, len = ref.length; j < len; col = ++j) {
//     child = ref[col];
//     bookOffsetY = Math.floor(curCount / booksPerSide) + 1;
//     if ((curCount % booksPerSide) + child.size < booksPerSide) {
//       el = appendRect(g, -radius + (curCount % booksPerSide) * bookSize, bookSize * child.size, radius - bookOffsetY * bookSize, bookSize);
//     } else {
//       bookOffsetY--;
//       firstLine = booksPerSide - (curCount % booksPerSide);
//       leftAfterFirstLine = child.size - firstLine;
//       blockHeight = Math.floor(leftAfterFirstLine / booksPerSide);
//       lastLine = leftAfterFirstLine - blockHeight * booksPerSide;
//       el = appendPoly(g, [[-radius + (curCount % booksPerSide) * bookSize, radius - bookOffsetY * bookSize], [-radius + booksPerSide * bookSize, radius - bookOffsetY * bookSize], [-radius + booksPerSide * bookSize, radius - (bookOffsetY + blockHeight + 1) * bookSize], [-radius + lastLine * bookSize, radius - (bookOffsetY + blockHeight + 1) * bookSize], [-radius + lastLine * bookSize, radius - (bookOffsetY + blockHeight + (lastLine > 0 ? 2 : 1)) * bookSize], [-radius, radius - (bookOffsetY + blockHeight + (lastLine > 0 ? 2 : 1)) * bookSize], [-radius, radius - (bookOffsetY + 1) * bookSize], [-radius + (curCount % booksPerSide) * bookSize, radius - (bookOffsetY + 1) * bookSize]]);
//     }
//     curCount += child.size;
//     child.parent = datum;
//     // applyClasses.call(el[0][0], child, inverted, combinationStyle, numLevels, hasFilters);
//   }
// };
//
// window.books = books;
// window.d3 = d3;
