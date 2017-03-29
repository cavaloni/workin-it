import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers/index';

const importedReducers = {
    reducers,
};

const allReducers = combineReducers(importedReducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
export default createStore(reducers.appReducer, enhancers);
