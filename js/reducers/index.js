const initialState = {
    userData: {},
};

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PROFILE_FETCH_SUCCESS': {
            return {
                userData: action.profile,
            };
        }
        default:
            return state;
    }
};
