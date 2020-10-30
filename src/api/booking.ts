import { getAdvertParentId } from '../utils/index';
import { FIELD_TYPE } from '../constants';
import fetchWrapper from './common';
declare const __API__: string;

export default (function () {

    async function getPrintPreview(sessionId: number, hash: string) {
        return await fetchWrapper(`${__API__}/Booking/PrintPreview?sessionId=${sessionId}&hash=${hash}`);
    }

    async function getBooking(sessionId: number, hash: string) {
        return await fetchWrapper(`${__API__}/Booking?sessionId=${sessionId}&hash=${hash}`);
    }

    async function createBooking(advertGroupId: number, token: string) {
        let body = { advertParentId: getAdvertParentId(), advertGroupId, token }

        return await fetchWrapper(`${__API__}/booking/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(body)
        });
    }

    async function saveBooking(sessionId: number, hash: string, advert: any) {
        return await fetchWrapper(`${__API__}/booking?sessionId=${sessionId}&hash=${hash}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(advert)
        });
    }

    async function uploadImage(sessionId: number, hash: string, file: any, cropOptions: any, imageNumber: number) {
        var formData = new FormData();
        formData.append('image', file);

        let url = `${__API__}/booking/uploadimage?sessionid=${sessionId}&hash=${hash}&imageNumber=${imageNumber}`;
        if (cropOptions) {
            url += `&minX=${cropOptions.minX}&maxX=${cropOptions.maxX}&minY=${cropOptions.minY}&maxY=${cropOptions.maxY}&rotate=${cropOptions.rotate}`
        }

        let response = await fetchWrapper(url, {
            method: 'POST',
            body: formData
        });

        return response.fileName;
    }

    return {
        getPrintPreview,
        createBooking,
        getBooking,
        saveBooking,
        uploadImage
    }
})();