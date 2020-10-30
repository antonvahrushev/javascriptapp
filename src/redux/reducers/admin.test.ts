import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'; //for async
import admin from './admin';
import { loadCategories, changeCategory, saveCategory } from '../actions/admin';
import CategoriesService, { Categories }from '../../services/categories';
import CategoryInfoService, { CategoryInfo } from '../../services/categoryInfo';

const categoriesResponce = [
    {
        advertGroupId: 1,
        description: 'cat1',
        subCategories: [
            {
                advertGroupId: 2,
                description: 'cat2'
            }
        ]
    },
    {
        advertGroupId: 3,
        description: 'cat3',
        subCategories: [
            {
                advertGroupId: 4,
                description: 'cat4'
            }
        ]
    }
];

describe('Admin state test group', () => {

    test('loadCategories should set categories with array length equals 4', async () => {
        //arrange        
        const categories = new (Categories as any)(categoriesResponce);
        CategoriesService.getInstanceAsync = jest.fn().mockResolvedValue(categories);
        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(new (CategoryInfo as any)());
        var store = createStore(
            combineReducers({
                admin
            }),
            {
                admin: {
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );
        
        //act
        await store.dispatch((loadCategories as any)(0));

        //assert
        const adminState = store.getState().admin;
        expect(adminState.advertParentId).toEqual(0);
        expect(adminState.categories.length).toEqual(4);
    });

    test('changeCategory should set category', async () => {
        //arrange
        const categoryInfo = new (CategoryInfo as any)();
        categoryInfo.getUserAuthorityAsync = jest.fn().mockResolvedValue({ userAllowed: true });
        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(categoryInfo);

        var store = createStore(
            combineReducers({
                admin
            }),
            {
                admin: {
                    advertGroupId: 0,
                    userAllowed: false
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        //act
        await store.dispatch((changeCategory as any)(2));

        //assert
        const adminState = store.getState().admin;
        expect(adminState.advertGroupId).toEqual(2);
        expect(adminState.userAllowed).toEqual(true);
    });

    test('saveCategory should drop changes flags', async () => {
        //arrange
        const categoryInfo = new (CategoryInfo as any)();
        categoryInfo.saveTextAsync = jest.fn();
        categoryInfo.uploadImageAsync = jest.fn();
        categoryInfo.dropImageAsync = jest.fn();        
        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(categoryInfo);

        var store = createStore(
            combineReducers({
                admin
            }),
            {
                admin: {
                    isCategoryChanged: true,
                    categoryText: 'new text',
                    originalCategoryText: 'old text',
                    categoryImageUrl: 'new image url',
                    originalCategoryImageUrl: 'old image url'
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        //act
        await store.dispatch((saveCategory as any)());

        //assert
        const adminState = store.getState().admin;
        expect(adminState.isCategoryChanged).toEqual(false);
        expect(adminState.categoryText).toEqual(adminState.originalCategoryText);
        expect(adminState.categoryImageUrl).toEqual(adminState.originalCategoryImageUrl);
    });
});