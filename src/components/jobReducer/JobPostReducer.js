export const jobReducer = (state, action) => {
    switch (action.type) {
        case "SET_VALUES":
            return {
                ...state,
                [action.key]: action.value
            };
        case "SET_ALL_NULL":
            return {};
        default:
            return state
    }
}

export const setValues = (key, value, dispatch) => {
    dispatch({
        type: "SET_VALUES",
        key,
        value
    })
}