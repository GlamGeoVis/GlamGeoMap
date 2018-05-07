import {
  SET_VIEWPORT,
  SET_ZOOM_LEVEL,
} from './constants';

export function setViewport(northEast, southWest) {
  return {
    type: SET_VIEWPORT,
    viewport: { northEast, southWest },
  };
}

export const setZoomLevel = (level) => ({
  type: SET_ZOOM_LEVEL,
  level,
});
