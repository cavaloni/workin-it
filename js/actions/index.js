import fetch from 'isomorphic-fetch';
import { Observable } from 'rxjs/Rx';
import qs from 'qs';

const O = Observable;

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = results => ({ type: FETCH_SUCCESS, results });

export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const setUserToken = token => ({ type: SET_USER_TOKEN, token });

export const PROFILE_FETCH_SUCCESS = 'PROFILE_FETCH_SUCCESS';
export const profileFetchSuccess = profile => ({ type: PROFILE_FETCH_SUCCESS, profile });

export const EXERCISE_DATA_FETCH_SUCCESS = 'EXERCISE_DATA_FETCH_SUCCESS';
export const exerciseDataFetchSuccess = data => ({ type: EXERCISE_DATA_FETCH_SUCCESS, data });

export const DELETE_FRIEND_LOCAL = 'DELETE_FRIEND_LOCAL';
export const deleteFriendLocal = index => ({ type: DELETE_FRIEND_LOCAL, index });

export const DELETE_FRIEND = 'DELETE_FRIEND';
export const deleteFriend = (index, friend, user) => (dispatch) => {
    O.ajax({
        url: '/user/delete_friend',
        body: qs.stringify({
            index,
            friend,
            user,
        }),
        method: 'PUT',
    }).subscribe((response) => {
        console.log(response);
        dispatch(profileFetchSuccess(response));
    });
};

export const addFriend = (user, friend, token) => (dispatch) => {
    O.ajax({
        url: '/user/add_friend',
        method: 'PUT',
        headers: { token },
        body: qs.stringify({
            user: {
                fbId: user.fbId,
                name: user.name,
            },
            friend: {
                fbId: friend.fbId,
                name: friend.name,
            },
        }),
        responseType: 'json',
    }).subscribe((response) => {
        dispatch(profileFetchSuccess(response.response));
    },
    err => console.log(err),
    );
};

export const getNewToken = initToken => (dispatch) => {
    O.ajax(`/new_token?initToken=${initToken}`)
        .subscribe(response => localStorage.setItem('id_token', response.getNewToken));
};

export const sendToken = token => (dispatch) => {
    O.ajax(`/new_token?initToken=${token}`)
        .subscribe(response => localStorage.setItem('id_token', response.getNewToken));
};


export const setUserProfile = () => (dispatch) => {
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

export const getExerciseData = user => (dispatch) => {
    console.log(user);
    O.ajax({
        url: '/exercise_data/get_data',
        body: { user },
        method: 'POST',
    })
            .subscribe(response => dispatch(exerciseDataFetchSuccess(response.response)));
}
;
