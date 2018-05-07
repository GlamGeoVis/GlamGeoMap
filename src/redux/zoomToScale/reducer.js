import {
  SET_ZOOM_TO_SCALE,
} from './constants';

const initialState = [
  1,      // zoom level 0 (completely zoomed out) <=> scale at max
  0.99,   // 1
  0.98,   // 2
  0.97,   // 3
  0.89,   // 4
  0.81,   // 5
  0.73,   // 6
  0.65,   // 7
  0.58,   // 8
  0.50,   // 9
  0.42,   // 10
  0.34,   // 11
  0.26,   // 12
  0.18,   // 13
  0.09,   // 14
  0,      // 15
];

export default (state = initialState, action) => {
  if (action.type === SET_ZOOM_TO_SCALE) {
    return action.value;
  }
  return state;
};
