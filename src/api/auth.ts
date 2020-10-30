import fetchWrapper from './common';
declare const __API__: string;

export default (function () {

    async function getToken(username: string, password: string, advertGroupId: number) {
        let body = {
            username,
            password,
            advertGroupId
        }
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        };
        return await fetchWrapper(`${__API__}/Token`, options)
    }

    async function isLoginNeeded(adParentId: number) {
        return await fetchWrapper(`${__API__}/Booking/login?advertParentId=${adParentId}`);
    }

    return {
        getToken,
        isLoginNeeded
    }
})();
