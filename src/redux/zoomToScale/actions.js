import {
  SET_ZOOM_TO_SCALE,
} from './constants';

export function setZoomToScale(value) {
  return {
    type: SET_ZOOM_TO_SCALE,
    value,
  };
}
