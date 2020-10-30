import BookingApi from '../api/booking';
import PaymentApi from '../api/payment';
import { PAYEX_CONTAINER_ID, LOGGED_USER_INVOICE_PAYMENT, FIELD_TYPE } from '../constants';
import PayExUtil, { PaymentMethods } from "../utils/payex";

export default (function () {
    var _cache = {};

    async function getInstanceAsync(advertGroupId: number, token: string) {
        if (!advertGroupId) return;
        if (!_cache.hasOwnProperty(advertGroupId)) {
            let session = await BookingApi.createBooking(advertGroupId, token);
            _cache[advertGroupId] = new (Booking as any)(session);
        }
        return _cache[advertGroupId];
    }

    return {
        getInstanceAsync
    }
})();

export function Booking(props: any) {
    props = props || {};
    var { sessionId, hash, preview } = props;

    async function getContentAsync() {
        let booking = await BookingApi.getBooking(sessionId, hash);
        return booking.bookingContent;
    }

    async function saveAsync(advert: any) {
        await uploadImagesAsync(advert);
        return await BookingApi.saveBooking(sessionId, hash, getAdjustedAdvertForPost(advert));
    }

    async function getPreviewAsync(forced: boolean = false) {
        if (!preview || forced) {
            preview = await BookingApi.getPrintPreview(sessionId, hash);
        }
        return new (Preview as any)(preview);
    }

    async function addCouponAsync(coupon: string) {
        await PaymentApi.addCoupon(sessionId, hash, coupon);
    }

    async function startPaymentAsync(paymentMethod: number, callback: any) {
        let response = await PaymentApi.initPayment(sessionId, hash, paymentMethod);
        props.paymentHash = response.paymentHash;
        await PayExUtil.openAsync(PAYEX_CONTAINER_ID, response.iframeUrl, paymentMethod, callback);
    }

    async function finishPaymentAsync() {
        let response = await PaymentApi.finishPayment(sessionId, hash);
        PayExUtil.close();
        return response.mailHtmlTemplate;
    }

    async function cancelPaymentAsync() {
        await PaymentApi.cancelPayment(sessionId, hash, props.paymentHash);
        PayExUtil.close();
    }

    async function startLoggedUserInvoicePaymentAsync() {
        let response = await PaymentApi.initPayment(sessionId, hash, LOGGED_USER_INVOICE_PAYMENT);
        return response.mailHtmlTemplate;
    }

    // private methods
    
    async function uploadImagesAsync(advert: any) {
        let imgIndex = 0;
        const values = Object.values(advert.fieldsMetaData);
        for (let i = 0; i < values.length; i++) {
            const field: any = values[i];

            if (field.type != FIELD_TYPE.IMAGE) continue;
            if (field.value.saved) continue;
            if (!field.value.file) continue;

            field.value.str = await BookingApi.uploadImage(sessionId, hash, field.value.file, field.value.cropOptions, ++imgIndex);
            field.value.saved = true;
        };
    }

    function getAdjustedAdvertForPost(advert: any) {
        const { fieldsMetaData } = advert;

        const inputFields = Object.entries(fieldsMetaData).map(([key, field]: [string, any]) => ({
            advertTemplateInputTypeId: key, value: field.value.str.trim()
        }));

        const result = {
            advertiserEmail: (advert.advertiserEmail || '').trim(),
            advertiserName: (advert.advertiserName || '').trim(),
            advertiserPhone: (advert.advertiserPhone || '').trim(),
            useImage: advert.useImage,
            inputFieldsHash: advert.inputFieldsHash,
            publishDates: advert.publishDates,
            inputFields
        }

        return result;
    }

    return {
        getContentAsync,
        saveAsync,
        getPreviewAsync,
        addCouponAsync,
        startPaymentAsync,
        finishPaymentAsync,
        cancelPaymentAsync,
        startLoggedUserInvoicePaymentAsync
    }
}

export function Preview(props: any) {
    props = props || {};
    var { imageUrl, publishTimes, valid } = props;

    function getImageUrl() {
        return imageUrl;
    }

    function getValid() {
        return valid;
    }

    function getPublishTimes() {
        if (!publishTimes) {
            return [];
        }
        return publishTimes.map((time: any) => {
            return {
                ...time,
                id: time.publishTimeText,
                name: time.publishTimeText,
            }
        });
    }

    function getPublishTimeById(id: number) {
        return getPublishTimes().find((t: any) => t.id == id);
    }

    return {
        getImageUrl,
        getPublishTimes,
        getValid,
        getPublishTimeById
    }
}