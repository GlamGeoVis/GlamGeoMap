/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';

import setViewportReducer from './containers/LeafletMap/reducer';
import filterReducer from './containers/LeftSideBar/reducer';
import { dataReducer, clusterDetailsReducer } from './containers/App/reducer';
import timelineReducer from './containers/Timeline/reducer';
import layoutReducer from './containers/Layout/reducer';

const routeInitialState = {
  location: null,
};

function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return ({
        location: action.payload,
      });
    default:
      return state;
  }
}

/* fixes some details about datasets, TODO: remove */
const fixedData = () => {
  const dataSets = {
    risse: {
      backendURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000',
      rows: 6924,
      name: 'risse',
    },
    trove: {
      backendURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000',
      rows: 100563,
      name: 'trove',
    },
  };

  return ({
    currentDataSet: window.location.search.substring(1) === 'trove' ? 'trove' : 'risse',
    dataSets,
  });
};


export default () => combineReducers({
  route: routeReducer,
  viewport: setViewportReducer,
  filters: filterReducer,
  data: dataReducer,
  clusterDetails: clusterDetailsReducer,
  timeline: timelineReducer,
  layout: layoutReducer,
  fixedData,
});
