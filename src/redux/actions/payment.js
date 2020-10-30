import { errorNotification } from './notifier';
import { showProgress, hideProgress } from './appUI';
import { push } from 'connected-react-router';
import { LOGGED_USER_INVOICE_PAYMENT } from '../../constants';
import { SET_PAYMENT_STATE, SET_ADVERT_STATE } from '../actionTypes';
import BookingService from '../../services/booking';

export const changeCoupon = (coupon) => ({
    type: SET_PAYMENT_STATE,
    partialValue: {
        coupon,
        couponError: ''
    }
});

export const changePaymentMethod = (selectedPaymentMethod) => ({
    type: SET_PAYMENT_STATE, 
    partialValue: {
        selectedPaymentMethod
    }    
});

export const goToPayment = (adParentId) => async (dispatch, getState) => {
    dispatch({ type: SET_ADVERT_STATE, partialValue: { forceValidation: true } }); // force validation
    const { advertErrors } = getState().advert;
    if (Object.keys(advertErrors).length > 0) {
        // Show and focus on validation summary panel
        dispatch({ type: SET_ADVERT_STATE, partialValue: { isValidationSummaryPanelFocused: true } });
        return;
    }

    try {
        dispatch(showProgress());
        const { advertGroupId } = getState().advert;
        let booking = await BookingService.getInstanceAsync(advertGroupId);
        await booking.saveAsync(getState().advert);
        dispatch(push(`/${adParentId}/payment`));
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const goToPayEx = (advertParentId) => async (dispatch, getState) => {
    let { paymentErrors } = getState().payment;
    if (Object.keys(paymentErrors).length > 0) return;

    let { advertGroupId } = getState().advert;
    let { coupon } = getState().payment;
    let booking = await BookingService.getInstanceAsync(advertGroupId);
    if (coupon) {
        dispatch(showProgress());
        try {
            await booking.addCouponAsync(coupon);
        } catch (e) {
            dispatch({
                type: SET_PAYMENT_STATE,
                partialValue: {
                    couponError: e.message
                }
            });
            console.error(e);
        } finally {
            dispatch(hideProgress());
        }
    }

    let { selectedPaymentMethod } = getState().payment;
    if (selectedPaymentMethod != LOGGED_USER_INVOICE_PAYMENT) {
        dispatch(push(`/${advertParentId}/payex`));
        return;
    }

    //Faktura payment method - Invoice for logged user
    dispatch(showProgress());
    try {
        let mailHtml = await booking.startLoggedUserInvoicePaymentAsync();
        dispatch({ type: SET_PAYMENT_STATE, partialValue: { mailHtml } });
        dispatch(push(`/${advertParentId}/finish`));
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const startPayEx = (advertParentId) => async (dispatch, getState) => {
    try {
        dispatch(showProgress());
        let { advertGroupId } = getState().advert;
        let { selectedPaymentMethod } = getState().payment;
        let booking = await BookingService.getInstanceAsync(advertGroupId);
        await booking.startPaymentAsync(selectedPaymentMethod, (obj) => dispatch(paymentCompleted(obj, advertParentId)));
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

const paymentCompleted = (obj, advertParentId) => async (dispatch, getState) => {
    try {
        dispatch(showProgress());
        let { advertGroupId } = getState().advert;
        let booking = await BookingService.getInstanceAsync(advertGroupId);
        let mailHtml = await booking.finishPaymentAsync();
        dispatch({ type: SET_PAYMENT_STATE, partialValue: { mailHtml } });
        dispatch(push(`/${advertParentId}/finish`));
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const returnToPayment = () => async (dispatch, getState) => {
    try {
        dispatch(showProgress());
        let { advertGroupId } = getState().advert;
        let booking = await BookingService.getInstanceAsync(advertGroupId);
        await booking.cancelPaymentAsync();
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}