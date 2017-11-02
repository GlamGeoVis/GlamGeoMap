import {
  REQUEST_COMPLETED,
} from './constants';

const initialState = [];

function dataReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COMPLETED:
      return { clusters: action.data.clusters, years: action.data.years };
    default:
      return state;
  }
}

export default dataReducer;
