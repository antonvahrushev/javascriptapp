import { SET_ADMIN_STATE } from "../actionTypes";

const defaultState = {
}

export default function (state = defaultState, action) {
    switch (action.type) {
       case SET_ADMIN_STATE:
            return {
                ...state,
                ...action.partialValue
            }
        default:
            return state;
    }
}