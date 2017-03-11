import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import '../assets/index.css';


import App from './components/app/app';
import Workout from './components/workout/workout';
import Home from './components/home/home';
import Progress from './components/progress/progress';

require('babel-polyfill');

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute path="/" component={Home} />
                <Route path="/1" component={Workout} />
                <Route path="/2" component={Progress} />
            </Route>
        </Router>
    </Provider>, document.getElementById('app')));
