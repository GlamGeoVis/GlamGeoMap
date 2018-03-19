import { select, takeLatest, put } from 'redux-saga/effects';
import { SET_ZOOM_LEVEL } from '../redux/LeafletMap/constants';
import { setScale } from '../redux/Scaler/actions';


function* setScaleAfterZoom(action) {
  const levels = yield select((state) => state.zoomToScale);
  yield put(setScale(levels[action.level]));
}

export default function* () {
  yield takeLatest(SET_ZOOM_LEVEL, setScaleAfterZoom);
}
