import { OPEN_DRAWER, CLOSE_DRAWER, OPEN_MENU, CLOSE_MENU, SHOW_PROGRESS, HIDE_PROGRESS } from "../actionTypes";

export const openDrawer = () => ({
    type: OPEN_DRAWER,
});

export const closeDrawer = () => ({
    type: CLOSE_DRAWER,
});

export const openMenu = (anchorEl) => ({
    type: OPEN_MENU,
    anchorEl
});

export const closeMenu = () => ({
    type: CLOSE_MENU,
});

export const showProgress = () => ({
    type: SHOW_PROGRESS,
});

export const hideProgress = () => ({
    type: HIDE_PROGRESS,
});