import { OPEN_DRAWER, CLOSE_DRAWER, OPEN_MENU, CLOSE_MENU, SHOW_PROGRESS, HIDE_PROGRESS } from "../actionTypes";

const defaultState = {
    isProgress: 0
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case OPEN_DRAWER:
            return {
                ...state,
                isDrawerOpened: true
            };
        case CLOSE_DRAWER:
            return {
                ...state,
                isDrawerOpened: false
            };
        case OPEN_MENU:
            return {
                ...state,
                anchorEl: action.anchorEl
            };
        case CLOSE_MENU:
            return {
                ...state,
                anchorEl: null
            };
        case SHOW_PROGRESS:
            return {
                ...state,
                isProgress: state.isProgress + 1
            };
        case HIDE_PROGRESS:
            return {
                ...state,
                isProgress: state.isProgress - 1
            };
        default:
            return state;
    }
}