import {
  SET_SCALE,
} from './constants';

const initialState = 0;

function scaleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SCALE:
      return action.value;
    default:
      return state;
  }
}

export default scaleReducer;
