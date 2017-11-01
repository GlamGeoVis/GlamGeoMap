import {
  REQUEST_COMPLETED,
} from './constants';

const initialState = [];

function dataReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COMPLETED:
      return action.data;
    default:
      return state;
  }
}

export default dataReducer;
