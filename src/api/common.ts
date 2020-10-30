export default async function fetchWrapper(uri: string, options?: any): Promise<any> {
    let response = await fetch(uri, options);
    let json = await response.json();
    if (!response.ok) {
        let message = json.message;
        if (typeof message === 'object') { // addCoupon return error message as object
            message = message.description; 
        }
        throw new Error(message || 'Ett fel uppstod på servern'); //An error occured on the server
    }
    return json.message;
}