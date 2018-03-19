/*
  Whenever there is new data or the timescale value changes, calculate
  list of glyphs, and aggregate the data.

  Input is the data in the leaves e.g. unclustered and the clustering structure.
  Clustering structure is e.g.

  {
      a: 0.9945369800452558,
      c: [
        {
          a: 0.9921363752861154,
          i: 351
        },
        {
          a: 0.9921363752861154,
          i: 5999
        }
      ]
  }

  Where `a` is the time of merging (at which time scale was this node created), and
  with `c` the children of the node. A leaf should have no `c` and `a==0`, and a key `i`,
  which corresponds to the data at index `i`.
 */

import L from 'leaflet';
import { select, takeLatest, put } from 'redux-saga/effects';
import { REQUEST_COMPLETED } from '../redux/App/constants';
import { SET_SCALE } from '../redux/Scaler/constants';
import { flattenNode, getLeaves, getNodesForScale } from '../utils/tree';
import { setGlyphsData } from '../redux/App/actions';
import { binEqualFrequency } from '../utils/statistics';
import { setZoomToScale } from '../redux/zoomToScale/actions';

const aggregateLeaves = (leaves, leafData) => {
  /* leaves are the leaves from clustering (e.g. without data) */
  const result = leaves.reduce((acc, cur) => {
    const data = leafData.find((leaf) => leaf.id === cur.i);
    acc.x += data.x;
    acc.y += data.y;
    acc.count += data.count;
    acc.years = acc.years.map((a, i) => a + data.yearBins[i]);
    return acc;
  }, {
    x: 0,
    y: 0,
    count: 0,
    years: [0, 0, 0, 0, 0, 0],
  });
  result.x /= leaves.length;
  result.y /= leaves.length;

  const latLng = L.Projection.SphericalMercator.unproject(new L.Point(result.x, result.y));
  result.lat = latLng.lat;
  result.lng = latLng.lng;

  return result;
};


function* findZoomToScale() {
  console.time('findZoomToScale');
  const clusterRootNode = yield select((state) => state.data.clusters);
  const aMax = clusterRootNode.a;
  const timeScales = flattenNode(clusterRootNode)
    .filter((node) => node.a !== 0)
    .map((node) => node.a / aMax);
  const sorted = [...binEqualFrequency(timeScales, 15).sort((a, b) => b - a), 0];
  yield put(setZoomToScale(sorted));

  console.timeEnd('findZoomToScale');
}

export function* aggregate() {
  yield findZoomToScale();
  console.time('aggregation');
  const leafData = yield select((state) => state.data.leafData);
  if (leafData && leafData.length > 0) {
    const clusterRootNode = yield select((state) => state.data.clusters);

    // maximum timescale is the fist node, where everything is merged
    const aMax = clusterRootNode.a;

    // current UI scale element scales from 0 to 1, so rescale it from 0 to aMax
    const scale = yield select((state) => (state.scale) * aMax);

    // const leavesForNode = getNodesForScale(clusterRootNode, aMax / 2).map(getLeaves);
    const nodeWithLeaves = getNodesForScale(clusterRootNode, scale).map((node) => ({
      ...node,
      leaves: getLeaves(node),
    }));
    const glyphs = nodeWithLeaves.map((obj) => ({ ...obj, data: aggregateLeaves(obj.leaves, leafData) }));
    console.timeEnd('aggregation');
    yield put(setGlyphsData(glyphs));
  }
}

export default function* () {
  yield takeLatest(REQUEST_COMPLETED, aggregate);
  yield takeLatest(SET_SCALE, aggregate);
}
