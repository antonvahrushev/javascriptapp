import { SET_LOGIN_STATE, TOGGLE_SHOW_PASSWORD } from "../actionTypes";

const defaultState = {
    isLoginOpened: false,
    username: '',
    password: '',
    showPassword: false,
    userDisplayedName: null
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case TOGGLE_SHOW_PASSWORD:
            return {
                ...state,
                showPassword: !state.showPassword
            };
        case SET_LOGIN_STATE:
            return {
                ...state,
                ...action.partialValue
            }
        default:
            return state;
    }
}