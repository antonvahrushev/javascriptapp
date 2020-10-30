
import fetchWrapper from './common';
declare const __API__: string;

export default (function() {

    let getCategoryInfoByIdPromise = {};

    async function getCategories(advertParentId: number) {
        return await fetchWrapper(`${__API__}/Newspaper/Categories?advertParentId=${advertParentId}`);
    }
    
    async function getCategoryInfoById(advertGroupId: number) {
        if (!getCategoryInfoByIdPromise[advertGroupId]) {
            getCategoryInfoByIdPromise[advertGroupId] = fetchWrapper(`${__API__}/Newspaper/CategoryInfo?advertGroupId=${advertGroupId}`)
                .then(response => {
                    delete getCategoryInfoByIdPromise[advertGroupId];
                    return response;
                });
        }
        return getCategoryInfoByIdPromise[advertGroupId];
    }

    async function getInfoTexts(advertGroupId: number) {
        return await fetchWrapper(`${__API__}/Newspaper/InfoTexts?categoryId=${advertGroupId}`);
    }

    async function getCustomInfo(advertGroupId: number) {
        return await fetchWrapper(`${__API__}/Newspaper/CustomInfo?advertGroupId=${advertGroupId}`);
    }

    async function uploadCustomInfoImage(advertGroupId: number, infoPlacementId: number, file: any, accessToken: string) {
        let headers = new Headers({ 'Authorization': accessToken });
        let url = `${__API__}/Newspaper/UploadCustomInfoImage?advertGroupId=${advertGroupId}&infoPlacementId=${infoPlacementId}`;
        let formData = new FormData();
        formData.append('image', file);
        return await fetchWrapper(
            url,
            {
                headers: headers,
                method: 'POST',
                body: formData
            }
        );
    }

    async function saveCustomInfo(advertGroupId: number, infoPlacementId: number, customInfo: any, accessToken: string) {
        let headers = new Headers({ 
            'Authorization': accessToken,
            'Content-Type': 'application/json;charset=utf-8'
        });
        let url = `${__API__}/Newspaper/CustomInfo?advertGroupId=${advertGroupId}&infoPlacementId=${infoPlacementId}`;
        return await fetchWrapper(
            url,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify(customInfo)
            }
        );
    }

    async function deleteCustomInfo(advertGroupId: number, infoPlacementId: number, accessToken: string) {
        let headers = new Headers({ 'Authorization': accessToken });
        let url = `${__API__}/Newspaper/CustomInfo?advertGroupId=${advertGroupId}&infoPlacementId=${infoPlacementId}`;
        return await fetchWrapper(
            url,
            {
                headers: headers,
                method: 'DELETE'
            }
        );
    }

    async function checkUserAuthority(advertGroupId: number, accessToken: string) {
        let headers = new Headers({ 'Authorization': accessToken });
        let url = `${__API__}/Newspaper/UserAllowed?advertGroupId=${advertGroupId}`;
        return await fetchWrapper(
            url,
            {
                headers: headers,
            }
        );
    }
    
    async function getRules(advertGroupId: number) {
        return await fetchWrapper(`${__API__}/Newspaper/rules?advertGroupId=${advertGroupId}`);
    }

    return {
        getCategories,
        getCategoryInfoById,
        getInfoTexts,
        getCustomInfo,
        uploadCustomInfoImage,
        saveCustomInfo,
        deleteCustomInfo,
        checkUserAuthority,
        getRules
    }
})();