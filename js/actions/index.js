import fetch from 'isomorphic-fetch';
import { Observable } from 'rxjs/Rx';

const O = Observable;

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = results => ({ type: FETCH_SUCCESS, results });

export const PROFILE_FETCH_SUCCESS = 'PROFILE_FETCH_SUCCESS';
export const profileFetchSuccess = profile => ({ type: PROFILE_FETCH_SUCCESS, profile });

export const getNewToken = initToken => (dispatch) => {
    console.log(initToken);
    O.ajax(`/new_token?initToken=${initToken}`)
        .subscribe(response => localStorage.setItem('id_token', response.getNewToken));
};

export const sendToken = token => (dispatch) => {
    O.ajax(`/new_token?initToken=${token}`)
        .subscribe(response => localStorage.setItem('id_token', response.getNewToken));
};

export const setUserToken = (token) => {
    localStorage.setItem('id_token', token);
};

export const setUserProfile = () => (dispatch) => {
    console.log('action happened');
    const getToken = O.of(localStorage.getItem('wi_id_token'));
    const profileFetch = tk => O.ajax({
        headers: {
            token: tk,
        },
        url: '/user/profile',
    });

    getToken
        .map(tkn => profileFetch(tkn))
        .concatAll()
        .subscribe((profile) => {
            if (profile.status === 201) {
                dispatch(profileFetchSuccess(profile.response));
            }
        },
        ((err) => {
            console.log(err);
        }));
};
