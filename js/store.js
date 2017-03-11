import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as burgerMenu } from 'redux-burger-menu';
import * as reducers from './reducers/index';

const importedReducers = {
    reducers,
    burgerMenu,
};

const allReducers = combineReducers(importedReducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
export default createStore(allReducers, enhancers);
