import React, { Component } from 'react';

import configureStore from './configureStore';
import './global-styles';
import createHistory from 'history/createBrowserHistory';
import Root from './containers/Root';
import {ConnectedRouter} from 'react-router-redux';
import {Provider} from 'react-redux';
import 'sanitize.css/sanitize.css';
// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);


class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Root/>
            </ConnectedRouter>
        </Provider>
    );
  }
}

export default App;
