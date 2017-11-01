import {
  SET_VIEWPORT,
} from './constants';

export function setViewport(northEast, southWest) {
  return {
    type: SET_VIEWPORT,
    viewport: { northEast, southWest },
  };
}
