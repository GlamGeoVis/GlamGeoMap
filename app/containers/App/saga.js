import { delay } from 'redux-saga';
import { put, call, takeLatest, select } from 'redux-saga/effects';
import 'whatwg-fetch';

import { SET_VIEWPORT } from '../LeafletMap/constants';
import { SET_TIME_RANGE } from '../Timeline/constants';
import { BACKEND_URL } from './constants';
import { request, requestCompleted, requestError } from './actions';

const getParametersForRequest = (state) => ({
  viewport: state.get('viewport'),
  range: state.get('timeline').range,
});

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
    yield call(delay, 100);
    const parameters = yield select(getParametersForRequest);
    yield put(request(parameters));
    const response = yield fetch(`${BACKEND_URL}/jsonData`, createFetchRequestOptions(parameters));
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
export default function* refresh() {
  yield takeLatest(SET_VIEWPORT, requestData);
  yield takeLatest(SET_TIME_RANGE, requestData);
}
