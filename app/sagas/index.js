import { fork } from 'redux-saga/effects';
import { clusterDetails, refresh } from './data';
import aggregateSaga from './aggregate';
import zoomToScale from './zoomToScale';

export default function* saga() {
  yield [
    fork(refresh),
    fork(clusterDetails),
    fork(aggregateSaga),
    fork(zoomToScale),
  ];
}
