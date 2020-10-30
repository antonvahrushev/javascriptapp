import Auth from '../api/auth';
import User from './user';

jest.mock('../api/auth');

describe('User service test group', () => {

    test('User cache should work as well', async () => {
        //arrange
        Auth.getToken.mockResolvedValue('token');

        //act
        const token = await User.getToken('username', 'password', 1);
        const the_same_token = await User.getToken('username', 'password', 1);

        //assert
        expect(token).toEqual('token');
        expect(the_same_token).toEqual('token');
        expect(Auth.getToken.mock.calls.length).toEqual(1);
    });
});