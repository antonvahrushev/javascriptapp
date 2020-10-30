import * as moment from 'moment';
import { errorNotification } from './notifier';
import { showProgress, hideProgress } from './appUI';
import {
    SET_INPUT_FIELD,
    SET_ADVERT_STATE,
} from "../actionTypes";
import { requestToken } from './loginDialog';
import { changePaymentMethod } from './payment';
import CategoriesService from '../../services/categories';
import CategoryInfoService from '../../services/categoryInfo';
import BookingService from '../../services/booking';

// public
export const changeCategory = (advertGroupId) => async (dispatch, getState) => {
    if (!advertGroupId) return;
    if (advertGroupId === getState().advert.advertGroupId) return;
    dispatch(showProgress());
    try {
        let categoryInfo = await CategoryInfoService.getInstanceAsync(advertGroupId);
        let paymentMethods = categoryInfo.getPaymentMethods();
        dispatch({
            type: SET_ADVERT_STATE,
            partialValue: {
                advertGroupId,
                fieldsMetaData: categoryInfo.getFieldsMetaData(),
                publishDateDeadlines: categoryInfo.getPublishDateDeadlines(),
                paymentMethods,
                categoryImageUrl: categoryInfo.getImageUrl(),
                categoryText: categoryInfo.getText(),
                lawRules: categoryInfo.getLawRules()
            }
        });

        if (paymentMethods && paymentMethods.length > 0) {
            dispatch(changePaymentMethod(paymentMethods[0].id));
        }

        if (categoryInfo.isLoginNeeded()) {
            const successLoginCallback = (advertGroupId, token) => createBooking(advertGroupId, token);
            dispatch(requestToken(successLoginCallback));
        }
        else {
            dispatch(createBooking(advertGroupId));
        }
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
};

export const loadCategories = (advertParentId) => async (dispatch, getState) => {
    try {
        dispatch(showProgress());
        let categories = await CategoriesService.getInstanceAsync(advertParentId);
        dispatch({ 
            type: SET_ADVERT_STATE,
            partialValue: {
                advertParentId,
                categories: categories.getList()
            }
        });
        let firstNoGroupCategory = categories.getFirstNoGroup();
        if (firstNoGroupCategory) {
            dispatch(changeCategory(firstNoGroupCategory.id));
        }
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const showLawRuleContent = (content) => ({
    type: SET_ADVERT_STATE,
    partialValue: {
        lawRuleContent: content,
        showLawRuleContent: true
    }
})

export const hideLawRuleContent = () => (
    {
        type: SET_ADVERT_STATE,
        partialValue: {
            showLawRuleContent: false
        }
    }
)

export const createBooking = (advertGroupId, token) => async (dispatch, getState) => {
    dispatch(showProgress());
    try {
        let booking = await BookingService.getInstanceAsync(advertGroupId, token);
        let content = await booking.getContentAsync();
        if (content) {
            dispatch({
                type: SET_ADVERT_STATE,
                partialValue: {
                    ...content
                }
            });
        }
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const loadPrintPreview = () => async (dispatch, getState) => {
    // validate booking content
    dispatch({ 
        type: SET_ADVERT_STATE, 
        partialValue: { 
            forcePreviewValidation: true, //set only preview validation
            forceValidation: false //drop total validation
        }
    });
    const { advertErrors } = getState().advert;
    if (Object.keys(advertErrors).length > 0) {
        // Show and focus on validation summary panel
        dispatch({ type: SET_ADVERT_STATE, partialValue: { isValidationSummaryPanelFocused: true } });
        return;
    }
    
    try {
        dispatch(showProgress());
        let { advertGroupId, useImage } = getState().advert;
        let booking = await BookingService.getInstanceAsync(advertGroupId);
        await booking.saveAsync(getState().advert);
        let forced = true;
        let preview = await booking.getPreviewAsync(forced);
        dispatch({
            type: SET_ADVERT_STATE,
            partialValue: {
                previewImage: preview.getImageUrl() + `?t=${moment().unix()}`,
                previewImageValid: preview.getValid(),
                publishTimes: preview.getPublishTimes().filter(publishTime => publishTime.withPic == useImage)
            }
        });
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const setSelectedPublishTime = (selectedPublishTime) => ({
    type: SET_ADVERT_STATE,
    partialValue: {
        selectedPublishTime,
        publishDates: []
    }
});

export const setPublishDates = (publishDates) => ({
    type: SET_ADVERT_STATE,
    partialValue: { publishDates }
});

export const changeName = (advertiserName) => ({
    type: SET_ADVERT_STATE,
    partialValue: { advertiserName }
});

export const changeEmail = (advertiserEmail) => ({
    type: SET_ADVERT_STATE,
    partialValue: { advertiserEmail }
});

export const changePhone = (advertiserPhone) => ({
    type: SET_ADVERT_STATE,
    partialValue: { advertiserPhone }
});

export const setInputField = (key, value) => (
    { type: SET_INPUT_FIELD, key, value }
)

export const setImageInputField = (key, value) => (dispatch, getState) => {
    let useImage = value.base64 ? true : false;
    dispatch({
        type: SET_ADVERT_STATE,
        partialValue: {
            useImage
        }
    });
    dispatch({ type: SET_INPUT_FIELD, key, value })
}

export const dropValidationSummaryPanelFocused = () => ({
    type: SET_ADVERT_STATE,
    partialValue: {
        isValidationSummaryPanelFocused: false
    }
});