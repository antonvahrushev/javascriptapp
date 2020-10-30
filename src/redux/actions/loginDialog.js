import { TOGGLE_SHOW_PASSWORD, SET_LOGIN_STATE } from "../actionTypes";
import User from '../../services/user';
import Admin from '../../services/admin';
import { errorNotification } from './notifier';
import { showProgress, hideProgress } from './appUI';
import { push, replace } from 'connected-react-router';

export const logIn = (successLoginCallback) => async (dispatch, getState) => {
    dispatch(showProgress());
    const { username, password } = getState().loginDialog;
    const { advertGroupId } = getState().advert;
    try {
        const token = await User.getToken(username, password, advertGroupId);
        dispatch(successLoginCallback(advertGroupId, token));
        dispatch({ type: SET_LOGIN_STATE, partialValue: { isLoginOpened: false } });
    } catch (e) {
        dispatch(errorNotification(e.message));
    } finally {
        dispatch(hideProgress());
    }
}

export const requestToken = (successLoginCallback) => (dispatch, getState) => {
    const { username, password } = getState().loginDialog;
    if (username && password) { // do not open login dialog but just use the credentials that user has already input
        dispatch(logIn(successLoginCallback));
    }
    else {
        dispatch({ 
            type: SET_LOGIN_STATE, 
            partialValue: { 
                isLoginOpened: true,
                loginAction: () => dispatch(logIn(successLoginCallback))
            } 
        });
    }
}

export const toggleShowPassword = () => ({
    type: TOGGLE_SHOW_PASSWORD
})

export const setUsername = (username) => ({
    type: SET_LOGIN_STATE,
    partialValue: { username }
})

export const setPassword = (password) => ({
    type: SET_LOGIN_STATE,
    partialValue: { password }
})

export const logInAdmin = (redirect) => async (dispatch, getState) => {
    dispatch(showProgress());
    const { username, password } = getState().loginDialog;
    try {
        await Admin.signIn(username, password);
        if (Admin.isAuthenticated()) {
            dispatch(replace(redirect));
            dispatch({
                type: SET_LOGIN_STATE,
                partialValue: {
                    isLoginOpened: false,
                    username: '',
                    password: '',
                    userDisplayedName: Admin.getUserName()
                }
            });
        }
    } catch (e) {
        dispatch(errorNotification(e.message));
    } finally {
        dispatch(hideProgress());
    }
}

export const logOutAdmin = () => (dispatch, getState) => {
    Admin.signOut();
    dispatch(replace(window.location.pathname)); // re-render without page full refresh
}

export const showAdminLoginDialog = (redirect) => (dispatch, getState) => {
    dispatch({ 
        type: SET_LOGIN_STATE, 
        partialValue: { 
            isLoginOpened: true,
            loginAction: () => dispatch(logInAdmin(redirect))
        } 
    });
}