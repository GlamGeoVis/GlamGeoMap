import {
  SET_VIEWPORT,
} from './constants';

const initialState = {
  northEast: { lat: 0, lng: 0 },
  southWest: { lat: 0, lng: 0 },
};

function setViewportReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIEWPORT:
      return action.viewport;
    default:
      return state;
  }
}

export default setViewportReducer;
