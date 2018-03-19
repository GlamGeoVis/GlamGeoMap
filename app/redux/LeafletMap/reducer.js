import {
  SET_VIEWPORT, SET_ZOOM_LEVEL,
} from './constants';

const initialState = {
  northEast: { lat: 0, lng: 0 },
  southWest: { lat: 0, lng: 0 },
  zoomLevel: 10,
};

function leafletMapReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIEWPORT:
      return { ...state, ...action.viewport };
    case SET_ZOOM_LEVEL:
      return { ...state, zoomLevel: action.level };
    default:
      return state;
  }
}

export default leafletMapReducer;
