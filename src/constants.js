export const FIELD_TYPE = {
    IMAGE: 'IMAGE',
    TEXT: 'TEXT',
    MULTIROWS_TEXT: 'MULTIROWS_TEXT'
}

export const WIZARD_STEPS = {
    BOOKING: { step: 1, path: '/:adParentId' },
    PAYMENT: { step: 2, path: '/:adParentId/payment' },
    PAYEX: { step: 3, path: '/:adParentId/payex' },
    FINISH: { step: 4, path: '/:adParentId/finish' }
}

export const EMPTY_FIELD_VALUE = { file: null, base64: null, str: '' }

export const LOGGED_USER_INVOICE_PAYMENT = 4;
export const PAYEX_CONTAINER_ID = "swedbank-pay-seamless-view-page";

export const ACCESS_TOKEN_KEY = 'access_token';
export const USER_NAME_KEY = 'user';
export const USER_ROLE_KEY = 'role';
export const ACCESS_TOKEN_EXPIRES = 'token_expires';