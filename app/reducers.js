/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { LOCATION_CHANGE } from 'react-router-redux';

import setViewportReducer from './containers/LeafletMap/reducer';
import filterReducer from './containers/LeftSideBar/reducer';
import dataReducer from './containers/App/reducer';
import timelineReducer from './containers/Timeline/reducer';
/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = {
  location: null,
};

function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
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
  timeline: timelineReducer,
});
