import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers/index';

const importedReducers = {
    reducers,
};

const allReducers = combineReducers(importedReducers);

let win;

if (window === undefined) {
    win = {};
} else { win = window; }



const composeEnhancers = win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
export default createStore(allReducers, enhancers);
