import {
    ENQUEUE_NOTIFICATION,
    CLOSE_NOTIFICATION,
    REMOVE_NOTIFICATION
} from '../actionTypes';

export const warningNotification = message => enqueueNotification({
    message,
    options: {
        variant: 'warning'
    }
});

export const successNotification = message => enqueueNotification({
    message,
    options: {
        variant: 'success'
    }
});

export const errorNotification = message => enqueueNotification({
    message,
    options: {
        variant: 'error'
    }
});

export const enqueueNotification = notification => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_NOTIFICATION,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

export const closeNotification = key => ({
    type: CLOSE_NOTIFICATION,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
});

export const removeNotification = key => ({
    type: REMOVE_NOTIFICATION,
    key,
});
