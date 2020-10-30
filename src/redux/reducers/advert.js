import {
    SET_INPUT_FIELD,
    SET_ADVERT_STATE
} from "../actionTypes";


const defaultState = {
    advertGroupId: '',
    categories: [],
    fieldsMetaData: {},
    publishTimes: [], // publish type of advert, for ex. 100:- 1 dag i tidningen utan bild
    selectedPublishTime: '',
    publishDateDeadlines: {
        daysApart: 0,
        deadlines: []
    }, // calendar restrictions
    previewImage: '',
    previewImageValid: true,
    advertErrors: {},
    forceValidation: false, // do not validate right after the page load
    forcePreviewValidation: false, // do not validate right after the page load
    isValidationSummaryPanelFocused: false
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case SET_INPUT_FIELD:
            const fieldToBeSet = state.fieldsMetaData[action.key];
            return {
                ...state,

                // If user changes an advert field the preview and prices become non-valid
                // the lines below clean all the preview area and remember selected values to restore if a new preview
                // is the same
                previewImageValid: true,
                previewImage: '', // new field value > no old preview...
                publishTimes: [], // ... no old prices and days amount...
                selectedPublishTime: '', // ...  no old selected value,
                publishDates: [], // ... no old publish dates

                fieldsMetaData: {
                    ...state.fieldsMetaData,
                    [action.key]: {
                        ...fieldToBeSet,
                        value: action.value
                    }
                }
            }
        case SET_ADVERT_STATE:
            return {
                ...state,
                ...action.partialValue
            }
        default:
            return state;
    }
}