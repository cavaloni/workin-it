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
import Friends from './components/friends/friends';
import Login from './components/login/login';

require('babel-polyfill');

document.addEventListener('DOMContentLoaded', () => ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Login} />
            <Route path="/app" component={App}>
                <IndexRoute path="/app" component={Home} />
                <Route path="/app/1" component={Workout} />
                <Route path="/app/2" props={{ friends: false }}component={Progress} />
                <Route path="/app/3" component={Friends} />
            </Route>
            
        </Router>
    </Provider>, document.getElementById('app')));
