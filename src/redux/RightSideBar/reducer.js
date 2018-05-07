import { SET_FILTER } from './constants';

const initialFilterState = { author: null, title: null };

function filterReducer(state = initialFilterState, action) {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state, [action.name]: action.value,
      };
    default:
      return state;
  }
}

export default filterReducer;
