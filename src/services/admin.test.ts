import * as moment from 'moment';
import AdminService from './admin';
import { ACCESS_TOKEN_EXPIRES } from '../constants';

describe('Admin service test group', () => {

    test('Admin service without token expires value should return that token is expired', () => {
        expect(AdminService.isTokenExpired()).toBeTruthy();
    });

    test('Admin service with correct token expires value should return that token is not expired', () => {
        let expires = moment().add(1, 'days').format();
        localStorage.setItem(ACCESS_TOKEN_EXPIRES, expires);
        expect(AdminService.isTokenExpired()).toBeFalsy();
    });

    test('Admin service with expired token expires value should return that token is expired', () => {
        let expires = moment().add(-1, 'days').format();
        localStorage.setItem(ACCESS_TOKEN_EXPIRES, expires);
        expect(AdminService.isTokenExpired()).toBeTruthy();
    });

});