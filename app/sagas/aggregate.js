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

import { select, takeLatest, put } from 'redux-saga/effects';
import { REQUEST_COMPLETED } from '../containers/App/constants';
import { SET_SCALE } from '../containers/Scaler/constants';
import { getLeaves, getNodesForScale } from '../utils/tree';
import { setGlyphsData } from '../containers/App/actions';

const aggregateLeaves = (leaves, leafData) => {
  const result = leaves.reduce((acc, cur) => {
    const data = leafData.find((leaf) => leaf[4] === cur.i);
    acc.lat += data[0];
    acc.lng += data[1];
    acc.count += data[2];
    acc.years = acc.years.map((a, i) => a + data[3][i]);
    return acc;
  }, {
    lat: 0,
    lng: 0,
    count: 0,
    years: [0, 0, 0, 0, 0, 0],
  });
  result.lat /= leaves.length;
  result.lng /= leaves.length;
  return result;
};


export function* aggregate() {
  console.time('aggregation');
  const leafData = yield select((state) => state.data.leafData);
  const clusterRootNode = yield select((state) => state.data.clusters);

  // maximum timescale is the fist node, where everything is merged
  const aMax = clusterRootNode.a;

  // current UI scale element scales from 0 to 100, so rescale it from 0 to aMax
  const scale = yield select((state) => (state.scale / 100) * aMax);

  // const leavesForNode = getNodesForScale(clusterRootNode, aMax / 2).map(getLeaves);
  const nodeWithLeaves = getNodesForScale(clusterRootNode, scale).map((node) => ({ ...node, leaves: getLeaves(node) }));
  console.log(nodeWithLeaves);
  const glyphs = nodeWithLeaves.map((obj) => ({ ...obj, data: aggregateLeaves(obj.leaves, leafData) }));
  console.timeEnd('aggregation');
  yield put(setGlyphsData(glyphs));
}

export default function* () {
  yield takeLatest(REQUEST_COMPLETED, aggregate);
  yield takeLatest(SET_SCALE, aggregate);
}
