import { delay } from 'redux-saga';
import { put, call, fork, takeLatest, select } from 'redux-saga/effects';
import 'whatwg-fetch';

import { SET_VIEWPORT } from '../LeafletMap/constants';
import { SET_TIME_RANGE } from '../Timeline/constants';
import { GET_CLUSTER_DETAILS } from './constants';
import {
  getClusterDetailsCompleted, getClusterDetailsError, request, requestCompleted,
  requestError,
} from './actions';
import { SET_FILTER } from '../LeftSideBar/constants';
import { toggleBar } from '../Layout/actions';

const filterTruthyValues = (obj) => // filters obj, leaves key value pairs with truthy value
  Object.keys(obj)
    .filter((key) => obj[key])
    .reduce((result, key) => ({ ...result, [key]: obj[key] }), {});

const getParametersForRequest = (state) => ({
  viewport: state.viewport,
  range: state.timeline.range,
  ...filterTruthyValues(state.filters),
});

const getBackendURL = (state) => state.fixedData.dataSets[state.fixedData.currentDataSet].backendURL;

const createFetchRequestOptions = (parameters) => ({
  method: 'POST',
  headers: new Headers({
    'Content-Type': 'application/json; charset=UTF-8',
  }),
  // mode: 'cors',
  body: JSON.stringify(parameters),
  cache: 'no-cache',
});

export function* requestData() {
  try {
    yield call(delay, 600);
    const parameters = yield select(getParametersForRequest);
    yield put(request(parameters));
    const backendURL = yield select(getBackendURL);
    const response = yield fetch(`${backendURL}/jsonData`, createFetchRequestOptions(parameters));
    if (response.status !== 200) {
      throw Error(`response status code was ${response.status}`);
    }
    const dataJSON = yield response.json();
    yield put(requestCompleted(dataJSON));
  } catch (err) {
    console.log('error', err);
    yield put(requestError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* refresh() {
  yield takeLatest(SET_VIEWPORT, requestData);
  yield takeLatest(SET_TIME_RANGE, requestData);
  yield takeLatest(SET_FILTER, requestData);
}

export function* requestClusterDetailsData(action) {
  try {
    yield call(delay, 400);
    const rightBarExpanded = yield select((state) => state.layout.bars.right);
    if (!rightBarExpanded) {
      yield put(toggleBar('right'));
    }
    const parameters = yield select(getParametersForRequest);
    parameters.id = action.id;
    const backendURL = yield select(getBackendURL);
    const response = yield fetch(`${backendURL}/clusterDetails`, createFetchRequestOptions(parameters));
    if (response.status !== 200) {
      throw Error(`response status code was ${response.status}`);
    }
    const dataJSON = yield response.json();
    yield put(getClusterDetailsCompleted(dataJSON));
  } catch (err) {
    console.log('error', err);
    yield put(getClusterDetailsError(err));
  }
}

export function* clusterDetails() {
  yield takeLatest(GET_CLUSTER_DETAILS, requestClusterDetailsData);
}

export default function* saga() {
  yield [
    fork(refresh),
    fork(clusterDetails),
  ];
}
