import fetch from 'isomorphic-fetch';
import Rx from 'rxjs';

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = results => ({ type: FETCH_SUCCESS, results });

export const getNewToken = initToken => (dispatch) => {
    console.log(initToken);
    Rx.Observable.ajax(`/new_token?initToken=${initToken}`)
        .subscribe(response => localStorage.setItem('id_token', response.getNewToken))
};

export const sendToken = token => (dispatch) => {
    Rx.Observable.ajax(`/new_token?initToken=${initToken}`)
        .subscribe(response => localStorage.setItem('id_token', response.getNewToken))
}

export const setUserToken = token => {
    localStorage.setItem('id_token', token)
}
