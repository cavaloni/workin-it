import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/observable/dom/ajax';
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
import Auth from './components/auth/auth';

require('babel-polyfill');

function requireAuth(nextState, replace) {
    const token = localStorage.getItem('wi_id_token');
    Observable.ajax({
        headers: {
            token,
        },
        url: 'verify_auth',
    })
        .subscribe((response) => {
            if (response.status !== 201) {
                replace({
                    pathname: '/',
                });
            }
        });
}
// word
document.addEventListener('DOMContentLoaded', () => ReactDOM.render( //eslint-disable-line
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Login} />
            <Route path="/auth/:initToken" component={Auth} />
            <Route path="/app" component={App} onEnter={requireAuth} >
                <IndexRoute path="/app" component={Home} />
                <Route path="/app/workout" component={Workout} />
                <Route path="/app/progress" props={{ friends: false }}component={Progress} />
                <Route path="/app/friends" component={Friends} />
            </Route>
        </Router>
    </Provider>, document.getElementById('app')));
