// import {
//   REQUEST_COMPLETED,
// } from './constants';

import { TOGGLE_BAR } from './constants';

const initialState = {
  bars: {
    left: false,
    right: false,
    bottom: true,
  },
};

function layoutReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_BAR:
      return { ...state, bars: { ...state.bars, [action.side]: !state.bars[action.side] } };
    default:
      return state;
  }
}

export default layoutReducer;
