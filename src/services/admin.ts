import {ACCESS_TOKEN_KEY, USER_NAME_KEY, USER_ROLE_KEY, ACCESS_TOKEN_EXPIRES} from '../constants';
import AdminAuth from '../api/adminAuth';
import * as moment from 'moment';

export default (function() {
    function isAuthenticated() {
        return !!localStorage.getItem(ACCESS_TOKEN_KEY) && !!localStorage.getItem(USER_ROLE_KEY) && !!localStorage.getItem(USER_NAME_KEY) && !isTokenExpired();
    }

    function getUserName() {
        return localStorage.getItem(USER_NAME_KEY);
    }

    async function signIn(userName: string, password: string) {
        let { accessToken, roles, expires } = await AdminAuth.getToken(userName, password);
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(USER_NAME_KEY, userName);
        localStorage.setItem(USER_ROLE_KEY, roles);
        localStorage.setItem(ACCESS_TOKEN_EXPIRES, moment(expires).format());
    }

    function signOut() {
        localStorage.clear();
    }

    function getRole() {
        return localStorage.getItem(USER_ROLE_KEY);
    }

    function isAdmin() {
        return isAuthenticated() && getRole() === 'AdBooker2020Admin';
    }

    function getToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    function isTokenExpired() {
        let expires = localStorage.getItem(ACCESS_TOKEN_EXPIRES);
        if (!expires) return true;        
        if (moment(expires) < moment()) return true;
        return false;
    }

    return {
        isAuthenticated,
        getUserName,
        isAdmin,
        signIn,
        signOut,
        getRole,
        getToken,
        isTokenExpired
    }
})();