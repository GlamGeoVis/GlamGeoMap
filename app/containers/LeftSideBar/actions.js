import {
  SET_FILTER,
} from './constants';

export function setFilter(name, value) {
  return {
    type: SET_FILTER,
    name,
    value,
  };
}
