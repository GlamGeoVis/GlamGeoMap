/*
 *
 * Timeline actions
 *
 */

import {
  SET_SCALE,
} from './constants';

export function setScale(value) {
  return {
    type: SET_SCALE,
    value
  };
}
