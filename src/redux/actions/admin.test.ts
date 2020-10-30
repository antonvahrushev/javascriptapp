import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'; //for async
import admin from '../reducers/admin';
import { saveCategory } from './admin';
import CategoryInfoService, { CategoryInfo } from '../../services/categoryInfo';

describe('Admin actions test group', () => {
    test('saveCategory should invoke saveText at least once', async () => {
        //arrange
        var store = createStore(
            combineReducers({
                admin
            }),
            {
                admin: {
                    categoryText: 'catText',
                    originalCategoryText: 'changedCatText'
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        const categoryInfo = new (CategoryInfo as any)();
        categoryInfo.saveTextAsync = jest.fn();
        categoryInfo.getImageUrl = jest.fn();
        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(categoryInfo);

        //act
        await store.dispatch((saveCategory as any)());

        //assert
        expect(categoryInfo.saveTextAsync.mock.calls.length).toEqual(1);
    });

    test('saveCategory should invoke uploadImageAsync at least once', async () => {
        //arrange
        var store = createStore(
            combineReducers({
                admin
            }),
            {
                admin: {
                    categoryImageUrl: 'imageUrl',
                    originalCategoryImageUrl: 'changedImageUrl',
                    categoryImageFile: 'file'
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        const categoryInfo = new (CategoryInfo as any)();
        categoryInfo.uploadImageAsync = jest.fn();
        categoryInfo.dropImageAsync = jest.fn();
        categoryInfo.getImageUrl = jest.fn();
        CategoryInfoService.getInstanceAsync  = jest.fn().mockResolvedValue(categoryInfo);

        //act
        await store.dispatch((saveCategory as any)());

        //assert
        expect(categoryInfo.uploadImageAsync.mock.calls.length).toEqual(1);
        expect(categoryInfo.dropImageAsync.mock.calls.length).toEqual(0);
    });

    test('saveCategory should invoke dropImageAsync at least once', async () => {
        //arrange
        var store = createStore(
            combineReducers({
                admin
            }),
            {
                admin: {
                    categoryImageUrl: 'imageUrl',
                    originalCategoryImageUrl: 'changedImageUrl',
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        const categoryInfo = new (CategoryInfo as any)();
        categoryInfo.uploadImageAsync = jest.fn();
        categoryInfo.dropImageAsync = jest.fn();
        categoryInfo.getImageUrl = jest.fn();
        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(categoryInfo);

        //act
        await store.dispatch((saveCategory as any)());

        //assert
        expect(categoryInfo.uploadImageAsync.mock.calls.length).toEqual(0);
        expect(categoryInfo.dropImageAsync.mock.calls.length).toEqual(1);
    });
})