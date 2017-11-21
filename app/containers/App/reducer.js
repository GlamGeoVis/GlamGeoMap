import {
  GET_CLUSTER_DETAILS_COMPLETED,
  REQUEST_COMPLETED,
} from './constants';

const initialState = {
  clusters: [],
  years: {},
  total: 0,
};

export function dataReducer(state = initialState, action) {
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

export function clusterDetailsReducer(state = [], action) {
  switch (action.type) {
    case GET_CLUSTER_DETAILS_COMPLETED:
      return action.data;
    default:
      return state;
  }
}
