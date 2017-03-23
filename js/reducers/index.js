const initialState = {
    userData: {},
};

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS': {
            console.log(action.results);
            return {
                userData: action.results,
            };
        }
        default:
            return state;
    }
};
