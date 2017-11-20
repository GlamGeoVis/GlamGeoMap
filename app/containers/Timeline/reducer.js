import {
  SET_TIME_RANGE,
} from './constants';

const initialState = { range: { start: 1500, end: 2000 } };

function timelineReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TIME_RANGE:
      return { range: action.range };
    default:
      return state;
  }
}

export default timelineReducer;
