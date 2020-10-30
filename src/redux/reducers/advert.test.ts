import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'; //for async
import { validateReducer } from 'redux-revalidate';
import advert from './advert';
import validateAdvert from './advertValidator';
import { loadCategories, changeCategory, loadPrintPreview } from '../actions/advert';
import CategoriesService, { Categories } from '../../services/categories';
import CategoryInfoService, { CategoryInfo } from '../../services/categoryInfo';
import BookingService, { Booking, Preview } from '../../services/booking';

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

describe('Advert action test group', () => {
    test('loadCategories should set categories with array length equals 4', async () => {
        //arrange
        var store = createStore(
            combineReducers({
                advert
            }),
            {
                advert: {
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        const categories = new (Categories as any)(categoriesResponce);       
        CategoriesService.getInstanceAsync = jest.fn().mockResolvedValue(categories);
        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(new (CategoryInfo as any)());
        const booking = new (Booking as any)();
        booking.getContentAsync = jest.fn();
        BookingService.getInstanceAsync = jest.fn().mockResolvedValue(booking);

        //act
        const advertParentId = 0;
        await store.dispatch((loadCategories as any)(advertParentId));

        //assert
        const advertState = store.getState().advert;
        expect(advertState.advertParentId).toEqual(advertParentId);
        expect(advertState.categories.length).toEqual(4);
    })

    test('changeCategory should change advertGroupId in the state', async () => {
        //arrange
        var store = createStore(
            combineReducers({
                advert
            }),
            {
                advert: {
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        CategoryInfoService.getInstanceAsync = jest.fn().mockResolvedValue(new (CategoryInfo as any)());
        const booking = new (Booking as any)();
        booking.getContentAsync = jest.fn();
        BookingService.getInstanceAsync = jest.fn().mockResolvedValue(booking);

        //act
        const advertGroupId = 2;
        await store.dispatch((changeCategory as any)(advertGroupId));

        //assert
        const advertState = store.getState().advert;
        expect(advertState.advertGroupId).toEqual(advertGroupId);
    })

    test('loadPrintPreview should change previewImage in the state', async () => {
        //arrange
        var store = createStore(
            combineReducers({
                advert: validateReducer( // see the comment below
                    validateAdvert, { errorKey: 'advertErrors' }
                  )(advert)
            }),
            {
                advert: {
                }
            },
            applyMiddleware(
                thunkMiddleware
            )
        );

        const imageUrl = 'imageUrl';
        const preview = new (Preview as any)( { imageUrl });
        const booking = new (Booking as any)();
        booking.saveAsync = jest.fn();
        booking.getPreviewAsync = jest.fn().mockResolvedValue(preview);
        BookingService.getInstanceAsync = jest.fn().mockResolvedValue(booking);

        //act
        await store.dispatch((loadPrintPreview as any)());

        //assert
        const advertState = store.getState().advert as any;
        expect(advertState.previewImage.substring(0, advertState.previewImage.indexOf('?'))).toEqual(imageUrl);
    })
})