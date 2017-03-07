import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import '../assets/index.css';

import App from './components/app/app';

require('babel-polyfill');

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
    </Router>
  </Provider>, document.getElementById('app')));
