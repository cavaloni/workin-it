const initialState = {
    userData: {},
    exerciseData: {},
    userToken: '',
};

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PROFILE_FETCH_SUCCESS': {
            return {
                ...state,
                userData: action.profile,
            };
        }
        case 'EXERCISE_DATA_FETCH_SUCCESS': {
            return {
                ...state,
                exerciseData: action.data,
            };
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


        default:
            return state;
    }
};
