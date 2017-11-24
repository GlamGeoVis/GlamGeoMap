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

export default () => combineReducers({
  route: routeReducer,
  viewport: setViewportReducer,
  filters: filterReducer,
  data: dataReducer,
  clusterDetails: clusterDetailsReducer,
  timeline: timelineReducer,
  layout: layoutReducer,
});
