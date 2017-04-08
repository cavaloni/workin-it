import { Observable } from 'rxjs/Rx';
import qs from 'qs';

const O = Observable;

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = results => ({ type: FETCH_SUCCESS, results });

export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const setUserToken = token => ({ type: SET_USER_TOKEN, token });

export const PROFILE_FETCH_SUCCESS = 'PROFILE_FETCH_SUCCESS';
export const profileFetchSuccess = profile => ({ type: PROFILE_FETCH_SUCCESS, profile });

export const LOGIN_FAIL = 'LOGIN_FAIL';
export const loginFail = () => ({ type: LOGIN_FAIL });

export const FETCH_FAILURE = 'FETCH_FAILURE';
export const fetchFailure = err => ({ type: FETCH_FAILURE, err });

export const RESET_FETCH_FAILURE = 'RESET_FETCH_FAILURE';
export const resetFetchFailure = () => ({ type: RESET_FETCH_FAILURE });

export const EXERCISE_DATA_FETCH_SUCCESS = 'EXERCISE_DATA_FETCH_SUCCESS';
export const exerciseDataFetchSuccess = data => ({ type: EXERCISE_DATA_FETCH_SUCCESS, data });

export const EXERCISE_DATA_NO_DATA = 'EXERCISE_DATA_NO_DATA';
export const exerciseDataNoData = () => ({ type: EXERCISE_DATA_NO_DATA });

export const EXERCISE_DATA_ONE_WEEK = 'EXERCISE_DATA_ONE_WEEK';
export const exerciseDataOneWeek = data => ({ type: EXERCISE_DATA_ONE_WEEK, data });

export const EXERCISE_ONE_WEEK_DATA_NO_DATA = 'EXERCISE_ONE_WEEK_DATA_NO_DATA';
export const exerciseOneWeekDataNoData = () => ({ type: EXERCISE_ONE_WEEK_DATA_NO_DATA });

export const DELETE_FRIEND_LOCAL = 'DELETE_FRIEND_LOCAL';
export const deleteFriendLocal = index => ({ type: DELETE_FRIEND_LOCAL, index });

export const DELETE_FRIEND = 'DELETE_FRIEND';
export const deleteFriend = (index, friend, user, token) => (dispatch) => {
    O.ajax({
        url: '/user/delete_friend',
        method: 'PUT',
        headers: { token },
        body: qs.stringify({
            index,
            friend,
            user,
        }),
    }).subscribe((response) => {
        dispatch(profileFetchSuccess(response.response));
    },
    ((err) => {
        dispatch(fetchFailure(err));
    }));
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
    ((err) => {
        dispatch(fetchFailure(err));
    }));
};

export const acceptFriend = (friendFbId, userFbId, token) => (dispatch) => {
    O.ajax({
        url: '/user/accept_friend',
        method: 'PUT',
        headers: { token },
        body: qs.stringify({
            userFbId,
            friendFbId,
        }),
        responseType: 'json',
    }).subscribe((response) => {
        dispatch(profileFetchSuccess(response.response));
    },
    ((err) => {
        dispatch(fetchFailure(err));
    }));
};

export const sendToken = initToken => (dispatch) => {
    O.ajax(`/new_token?initToken=${initToken}`)
        .subscribe((response) => {
            localStorage.setItem('id_token', response.getNewToken);
        },
        ((err) => {
            dispatch(fetchFailure(err));
        }));
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
            dispatch(fetchFailure(err));
        }));
};

export const getExerciseData = (token, user, year, week, oneWeek) => (dispatch) => {
    O.ajax({
        url: '/exercise_data/get_data',
        body: { user, year, week, oneWeek },
        headers: { token },
        method: 'POST',
    })
        .subscribe((response) => {
            if (oneWeek) {
                dispatch(exerciseDataOneWeek(response.response));
                if (response.response.data === 'no data') {
                    dispatch(exerciseOneWeekDataNoData());
                }
            }
            if (response.response.data === 'no data') {
                dispatch(exerciseDataNoData());
            }
            dispatch(exerciseDataFetchSuccess(response.response));
        },
        ((err) => {
            dispatch(fetchFailure(err));
        }));
};

export const saveExerciseData = (token, user, dataToSave, year, week) => (dispatch) => {
    O.ajax({
        url: '/exercise_data',
        body: qs.stringify({ user, dataToSave, year, week }),
        headers: {
            token,
        },
        method: 'PUT',
    })
        .subscribe((response) => {
            dispatch(exerciseDataFetchSuccess(response.response));
        },
        ((err) => {
            dispatch(fetchFailure(err));
        }));
};
