import DictionaryApi from '../api/dictionaries';

export default (function(){
    async function getInstanceAsync(advertParentId: number) {
        let categories: Array<any> = await DictionaryApi.getCategories(advertParentId);
        return new (Categories as any)(categories);
    }

    return {
        getInstanceAsync
    }
})();

export function Categories(categories: Array<any>) {
    let _categories: Array<any> = categories;
    let _categoriesAsFlatStructure: Array<any> = [];
    getFlatCategories(_categories, _categoriesAsFlatStructure, 0);

    //*** public methods ***

    function getList() {
        return _categoriesAsFlatStructure;
    }

    function getFirstNoGroup() {
        if (!_categoriesAsFlatStructure.length) return;
        for (var i = 0; i < _categoriesAsFlatStructure.length; i++) {
            if (!_categoriesAsFlatStructure[i].isGroup) return _categoriesAsFlatStructure[i];
        }
    }

    //*** pivate methods ***

    function getFlatCategories(categories: Array<any>, result: Array<any>, level: number) {
        if (!categories) return;
        level++;
        categories.forEach(category => {
            if (category.subCategories) { // parent
                result.push({ // not parent, bottom level
                    id: category.advertGroupId,
                    name: category.description,
                    groupLevel: level,
                    isGroup: true
                });
                getFlatCategories(category.subCategories, result, level);
                return;
            }
            
            result.push({ // not parent, bottom level
                id: category.advertGroupId,
                name: category.description,
                groupLevel: level,
                isGroup: false
            });
        });
    }

    return {
        getList,
        getFirstNoGroup
    }
}