/*
 *
 * Timeline actions
 *
 */

import {
  SET_TIME_RANGE,
} from './constants';

export function setTimeRange(start, end) {
  return {
    type: SET_TIME_RANGE,
    range: { start, end },
  };
}
