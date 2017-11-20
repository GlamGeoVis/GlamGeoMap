import {
  REQUEST_COMPLETED,
} from './constants';

const initialState = {
  clusters: [],
  years: {},
  total: 0,
};

function dataReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COMPLETED:
      return {
        clusters: action.data.clusters,
        years: action.data.years,
        total: action.data.total,
      };
    default:
      return state;
  }
}

export default dataReducer;
