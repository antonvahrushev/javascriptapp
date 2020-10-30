import Auth from '../api/auth';

interface UserCache {
    [propName: number]: string;
}

export default (function() {
    let _token: UserCache = {};

    async function getToken(username: string, password: string, advertGroupId: number): Promise<string> {
        if (!_token[advertGroupId])
            _token[advertGroupId] = await Auth.getToken(username, password, advertGroupId);

        return _token[advertGroupId];
    }

    return {
        getToken
    }
})()