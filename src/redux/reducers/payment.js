import {
    SET_PAYMENT_STATE
} from "../actionTypes";

const defaultState = {
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case SET_PAYMENT_STATE:
            return {
                ...state,
                ...action.partialValue
            }
        default:
            return state;
    }
}