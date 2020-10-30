declare const __API__: string;
declare const __APIToken__: string;

export default (function () {
    async function getToken(userName: string, password: string) {
        let response = await fetch(`${__APIToken__}/token`, {
            method: 'POST',
            body: `grant_type=password&client_id=AdBooker2020&username=${userName}&password=${password}`
        });
        let json = await response.json();
        if (!response.ok) {
            throw new Error(json.error_description || 'Ett fel uppstod på servern'); //An error occured on the server
        }
        return { 
            accessToken: json.token_type + ' ' + json.access_token, 
            roles: json['role(s)'],
            expires: json['.expires']
         };
    }

    async function getUser(accessToken: string) {
        let headers = new Headers({ 'Authorization': accessToken });
        let response = await fetch(`${__API__}/user`, { headers: headers });
        let json = await response.json();
        if (!response.ok) {
            throw new Error(json.Message || 'Ett fel uppstod på servern');
        }
        return json;
    }

    async function signOut(accessToken: string) {
        let headers = new Headers({ 'Authorization': accessToken });
        let response = await fetch(`${__API__}/user/logout`, { headers: headers });
        if (!response.ok) {
            let json = await response.json();
            throw new Error(json.Message || 'Ett fel uppstod på servern');
        }
    }

    return {
        getToken,
        getUser,
        signOut
    }
})();
