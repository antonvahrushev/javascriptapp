import { SET_ADMIN_STATE } from "../actionTypes";
import { errorNotification, successNotification, warningNotification } from './notifier';
import { showProgress, hideProgress } from './appUI';
import CategoriesService from '../../services/categories';
import CategoryInfoService from '../../services/categoryInfo';
import AdminService from '../../services/admin';

export const loadCategories = (advertParentId) => async (dispatch, getState) => {
    try {
        dispatch(showProgress());
        let categories = await CategoriesService.getInstanceAsync(advertParentId);
        dispatch({
            type: SET_ADMIN_STATE,
            partialValue: {
                advertParentId,
                categories: categories.getList()
            }
        });

        let firstNoGroupCategory = categories.getFirstNoGroup();
        if (firstNoGroupCategory) {
            dispatch(changeCategory(firstNoGroupCategory.id));
        }
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const changeCategory = (advertGroupId) => async (dispatch, getState) => {
    if (!advertGroupId) return;
    if (advertGroupId === getState().admin.advertGroupId) return;
    dispatch(showProgress());
    try {
        let categoryInfo = await CategoryInfoService.getInstanceAsync(advertGroupId);
        let categoryText = categoryInfo.getText();
        let categoryImageUrl = categoryInfo.getImageUrl();
        let userAuthority = await categoryInfo.getUserAuthorityAsync(AdminService.getToken());
        let userAllowed = false;
        if (userAuthority) {
            userAllowed = userAuthority.userAllowed;
            if (!userAllowed) dispatch(warningNotification(userAuthority.message));
        }
        dispatch({
            type: SET_ADMIN_STATE,
            partialValue: {
                advertGroupId,
                categoryText,
                originalCategoryText: categoryText,
                categoryImageUrl,
                originalCategoryImageUrl: categoryImageUrl,
                userAllowed
            }
        });
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}

export const changeCategoryText = (categoryText) => async (dispatch, getState) => {
    let { originalCategoryText } = getState().admin;
    dispatch({
        type: SET_ADMIN_STATE,
        partialValue: {
            categoryText,
            isCategoryChanged: categoryText != originalCategoryText
        }
    });
}

export const changeCategoryImage = (categoryImageUrl, categoryImageFile) => ({
    type: SET_ADMIN_STATE,
    partialValue: {
        categoryImageUrl,
        categoryImageFile,
        isCategoryChanged: true
    }
})

export const saveCategory = () => async (dispatch, getState) => {
    dispatch(showProgress());
    try {
        let {
            advertGroupId,
            categoryText,
            originalCategoryText,
            categoryImageUrl,
            originalCategoryImageUrl,
            categoryImageFile
        } = getState().admin;
        let categoryInfo = await CategoryInfoService.getInstanceAsync(advertGroupId);
        if (categoryText != originalCategoryText) {
            await categoryInfo.saveTextAsync(categoryText, AdminService.getToken());
        }
        if (categoryImageUrl != originalCategoryImageUrl) {
            if (categoryImageFile) {
                await categoryInfo.uploadImageAsync(categoryImageFile, AdminService.getToken());
            } else {
                await categoryInfo.dropImageAsync(AdminService.getToken());
            }
        }
        dispatch({
            type: SET_ADMIN_STATE,
            partialValue: {
                isCategoryChanged: false,
                originalCategoryText: categoryText,
                categoryImageUrl: categoryInfo.getImageUrl(),
                originalCategoryImageUrl: categoryInfo.getImageUrl()
            }
        });
        dispatch(successNotification('Kategorin sparades OK'));
    } catch (e) {
        dispatch(errorNotification(e.message));
        console.error(e);
    } finally {
        dispatch(hideProgress());
    }
}