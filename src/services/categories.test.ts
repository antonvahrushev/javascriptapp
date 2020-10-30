import DictionaryApi from '../api/dictionaries';
import CategoriesService, { Categories } from './categories';

jest.mock('../api/dictionaries');

describe('Categories test group', () => {

    test('CategoriesService should return instance of Categories object', async () => {
        //arrange
        (DictionaryApi.getCategories as any).mockResolvedValue([]);

        //act
        const categories = await CategoriesService.getInstanceAsync(0);

        //assert
        expect(categories).toEqual(
            expect.objectContaining({
                getList: expect.any(Function),
                getFirstNoGroup: expect.any(Function)
        }));
    });

    test('Created Categories with empty initialization data should have empty list of categories', () => {
        expect(new (Categories as any)().getList()).toEqual([]);
    });

    test('Created Categories with one level structure data should have list of categories with only group level equal 1', () => {
        //arrange
        const categories = [
            {
                advertGroupId: 1,
                description: 'cat1'
            },
            {
                advertGroupId: 2,
                description: 'cat2'
            },
        ];

        //act & assert
        expect(new (Categories as any)(categories).getList()).toEqual([
            {
                id: 1,
                name: 'cat1',
                groupLevel: 1,
                isGroup: false
            },
            {
                id: 2,
                name: 'cat2',
                groupLevel: 1,
                isGroup: false
            }
        ]);
    });

    test('Created Categories with subcatrgories structure data should have list of categories with flat structure', () => {
        //arrange
        const categories = [
            {
                advertGroupId: 1,
                description: 'cat1',
                subCategories: [
                    {
                        advertGroupId: 2,
                        description: 'cat2'
                    }
                ]
            }
        ];

        //act & assert
        expect(new (Categories as any)(categories).getList()).toEqual([
            {
                id: 1,
                name: 'cat1',
                groupLevel: 1,
                isGroup: true
            },
            {
                id: 2,
                name: 'cat2',
                groupLevel: 2,
                isGroup: false
            }
        ]);
    });

    test('Created Categories with subcatrgories structure data should have first no group category with id equal 2', () => {
        //arrange
        const categories = [
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

        //act & assert
        expect(new (Categories as any)(categories).getFirstNoGroup()).toEqual(
            {
                id: 2,
                name: 'cat2',
                groupLevel: 2,
                isGroup: false
            }
        );
    });
});
