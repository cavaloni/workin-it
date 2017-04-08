const initialState = {
    userData: {},
    exerciseData: {},
    userToken: '',
    oneWeekData: {},
    fetchFailed: false,
    errMessage: '',
    loginFail: false,
};

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PROFILE_FETCH_SUCCESS': {
            return {
                ...state,
                userData: action.profile,
                loginFail: false,
            };
        }
        case 'EXERCISE_DATA_FETCH_SUCCESS': {
            return {
                ...state,
                exerciseData: action.data,
            };
        }
        case 'FETCH_FAILURE': {
            return {
                ...state,
                fetchFailed: true,
                errMessage: action.err,
            };
        }
        case 'LOGIN_FAIL': {
            return {
                ...state,
                loginFail: true,
            };
        }
        case 'RESET_FETCH_FAILURE': {
            return {
                ...state,
                fetchFailed: false,
                errMessage: '',
            };
        }
        case 'EXERCISE_DATA_NO_DATA': {
            return state;
        }
        case 'DELETE_FRIEND': {
            const friendsListCopy = Array.from(state.userData.friends);
            friendsListCopy.splice(action.index, 1);
            return {
                ...state,
                userData: {
                    ...state.userData,
                    friends: friendsListCopy,
                },
            };
        }
        case 'SET_USER_TOKEN': {
            return {
                ...state,
                userToken: action.token,
            };
        }
        case 'EXERCISE_DATA_ONE_WEEK': {
            return {
                ...state,
                oneWeekData: action.data.data[Object.keys(action.data.data)[0]],
            };
        }
        case 'EXERCISE_ONE_WEEK_NO_DATA': {
            return {
                ...state,
                oneWeekData: {},
            };
        }

        default:
            return state;
    }
};
