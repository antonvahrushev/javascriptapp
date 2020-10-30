import * as moment from 'moment';
import DictionaryApi from '../api/dictionaries';
import Auth from '../api/auth';
import { FIELD_TYPE, EMPTY_FIELD_VALUE } from '../constants';

interface CategoryInfoCache {
    [propName: number]: any;
}

export default (function () {
    var _cache: CategoryInfoCache = {};

    async function getInstanceAsync(advertGroupId: number) {
        if (!advertGroupId) return;
        if (!_cache.hasOwnProperty(advertGroupId)) {
            let categoryInfoPromise = DictionaryApi.getCategoryInfoById(advertGroupId);
            let customInfoPromise = DictionaryApi.getCustomInfo(advertGroupId);
            let loginNeededPromise = Auth.isLoginNeeded(advertGroupId); // Swagger says that we need to send advertParentId, but Magnus set that need to check for advertGrouptId, in the back-side controller invokes stored procedure with advertGroupId
            let lawRulesPromise = DictionaryApi.getRules(advertGroupId);
            let results = await Promise.all([categoryInfoPromise, customInfoPromise, loginNeededPromise, lawRulesPromise]);
            _cache[advertGroupId] = new (CategoryInfo as any)({
                info: results[0],
                customInfos: results[1],
                isLoginNeeded: results[2],
                lawRules: results[3],
                userAuthority: {}                
            });
        }

        return _cache[advertGroupId];
    }

    return {
        getInstanceAsync
    }
})();

export function CategoryInfo(props: any) {
    props = props || {};
    var _info = props.info;
    var _customInfos = props.customInfos;
    var _userAuthority = props.userAuthority;
    var _isLoginNeeded = props.isLoginNeeded;
    var _lawRules = props.lawRules || [];

    //*** public methods ***

    function getFieldsMetaData() {
        if (!(_info && _info.fields)) return {};

        const result = {};
        _info.fields.forEach((field: any) => {
            result[field.advertTemplateInputTypeId] = {
                id: field.advertTemplateInputTypeId,
                name: field.description,
                type: getFieldMetaDataType(field.inputType, field.isDocument),
                isRequired: field.isRequired,
                defaultValue: field.defaultValue,
                caMinCharacterCountPerRow: field.caMinCharacterCountPerRow,
                caMaxCharacterCountPerRow: field.caMaxCharacterCountPerRow,
                totalAllowedRows: field.totalAllowedRows,
                value: field.defaultValue ? { ...EMPTY_FIELD_VALUE, str: field.defaultValue } : EMPTY_FIELD_VALUE
            }
        });
        return result;
    }

    function getPublishDateDeadlines() {
        if (!_info) return {
            daysApart: 0,
            deadlines: []
        };

        let deadlines = [];
        if (_info.monthDeadlines) {
            deadlines = _info.monthDeadlines
                .reduce((accum: any, value: any) => accum.concat(value.deadlines), [])
                .map((deadline: any) => {
                    return {
                        available: deadline.available,
                        date: moment(deadline.date).format('YYYY-MM-DD')
                    }
                });
        }
        return {
            daysApart: _info.publishDaysApart,
            deadlines: deadlines
        }
    }

    function getPaymentMethods() {
        if (!(_info && _info.paymentMethods)) return [];
        
        return _info.paymentMethods.map((method: any) => {
            return {
                id: method.paymentId,
                name: method.description
            }
        });
    }

    function getText() {
        if (!(_customInfos && _customInfos.length > 0)) return '';
        return _customInfos[0].text;
    }

    function isLoginNeeded() {
        return !!_isLoginNeeded;
    }

    async function saveTextAsync(text: string, accessToken: string) {
        let infoPlacementId = 1; //TODO what the parameter for API?
        let customInfo = {
            text
        }
        await DictionaryApi.saveCustomInfo(_info.advertGroupId, infoPlacementId, customInfo, accessToken);
        _customInfos =  await DictionaryApi.getCustomInfo(_info.advertGroupId);
    }

    function getImageUrl() {
        if (!(_customInfos && _customInfos.length > 0)) return '';
        return _customInfos[0].imageUrl;
    }

    async function uploadImageAsync(file: any, accessToken: string) {
        let infoPlacementId = 1; //TODO what the parameter for API?
        await DictionaryApi.uploadCustomInfoImage(_info.advertGroupId, infoPlacementId, file, accessToken);
        _customInfos =  await DictionaryApi.getCustomInfo(_info.advertGroupId);
    }

    async function dropImageAsync(accessToken: string) {
        let infoPlacementId = 1; //TODO what the parameter for API?
        let customInfo = {
            imageUrl: '',
        }          
        await DictionaryApi.saveCustomInfo(_info.advertGroupId, infoPlacementId, customInfo, accessToken);
        _customInfos =  await DictionaryApi.getCustomInfo(_info.advertGroupId);
    }

    async function getUserAuthorityAsync(accessToken: string) {
        if (!accessToken) return;
        if (!_userAuthority.hasOwnProperty(accessToken)) {
            _userAuthority[accessToken] = await DictionaryApi.checkUserAuthority(_info.advertGroupId, accessToken);
        }
        return _userAuthority[accessToken];
    }

    function getLawRules() {        
        return _lawRules;
    }

    //*** pivate methods ***

    function getFieldMetaDataType(inputType: number, isDocument: boolean) {
        switch (inputType) {
            case 0: return isDocument ? FIELD_TYPE.IMAGE : FIELD_TYPE.TEXT;
            case 1: return FIELD_TYPE.TEXT;
            case 2: return FIELD_TYPE.MULTIROWS_TEXT;
            default: return FIELD_TYPE.TEXT;
        }
    }

    return {
        getFieldsMetaData,
        getPublishDateDeadlines,
        getPaymentMethods,
        getText,
        isLoginNeeded,
        saveTextAsync,
        getImageUrl,
        uploadImageAsync,
        dropImageAsync,
        getUserAuthorityAsync,
        getLawRules
    }
}