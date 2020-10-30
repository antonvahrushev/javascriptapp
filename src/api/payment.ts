import fetchWrapper from './common';
declare const __API__: string;

export default (function() {

    async function initPayment(sessionId: number, hash: string, paymentType: number) {
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        }
        return await fetchWrapper(`${__API__}/Booking/InitPayment?sessionId=${sessionId}&hash=${hash}&paymentType=${paymentType}`, options);
    }
   
    async function finishPayment(sessionId: number, hash: string) {
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        }
        return await fetchWrapper(`${__API__}/Booking/Save?sessionId=${sessionId}&hash=${hash}`, options);
    }

    async function cancelPayment(sessionId: number, hash: string, paymentHash: string, cancelDescription: string = '') {
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        }
        cancelDescription = cancelDescription ? '&cancelDescription=' + cancelDescription : '';
        return await fetchWrapper(`${__API__}/Booking/CancelPayment?sessionId=${sessionId}&hash=${hash}&paymentHash=${paymentHash}${cancelDescription}`, options);
    }

    async function addCoupon(sessionId: number, hash: string, coupon: string) {
        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        }
        return await fetchWrapper(`${__API__}/Booking/AddCoupon?sessionId=${sessionId}&hash=${hash}&coupon=${coupon}`, options);
    }

    return {
        initPayment,
        finishPayment,
        cancelPayment,
        addCoupon
    }
})();