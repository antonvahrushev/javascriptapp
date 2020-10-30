import { CategoryInfo } from './categoryInfo';
import { FIELD_TYPE, EMPTY_FIELD_VALUE } from '../constants';

describe('CategoryInfo test group', () => {

    test('Created CategoryInfo with empty initialization data should have empty field meta data object', () => {
        expect(new (CategoryInfo as any)().getFieldsMetaData()).toEqual({});
    });

    test('Created CategoryInfo with initialization data should have certain structure object of the meta-data fields', () => {
        const props = {
            info: {
                fields: [
                    {
                        advertTemplateInputTypeId: 1,
                        caMaxCharacterCountPerRow: 10,
                        caMinCharacterCountPerRow: 3,
                        defaultValue: '',
                        description: 'description1',
                        inputType: 0,
                        isDocument: false,
                        isRequired: true,
                        totalAllowedRows: 2
                    }
                ]
            }
        }

        expect(new (CategoryInfo as any)(props).getFieldsMetaData()).toEqual({
            1: {
                id: 1,
                name: 'description1',
                type: FIELD_TYPE.TEXT,
                isRequired: true,
                defaultValue: '',
                caMinCharacterCountPerRow: 3,
                caMaxCharacterCountPerRow: 10,
                totalAllowedRows: 2,
                value: EMPTY_FIELD_VALUE
            }
        });
    });

    test('Created CategoryInfo with initialization data of fields with { isDocument: true and inputType: 0 } should have meta-data fields with type as image', () => {
        const props = {
            info: {
                fields: [
                    {
                        advertTemplateInputTypeId: 1,
                        inputType: 0,
                        isDocument: true
                    }
                ]
            }
        }

        expect(new (CategoryInfo as any)(props).getFieldsMetaData()).toEqual({
            1: {
                id: 1,
                type: FIELD_TYPE.IMAGE,
                value: EMPTY_FIELD_VALUE
            }
        });
    });

    test('Created CategoryInfo with initialization data of fields with { isDocument: false and inputType: 0 } should have meta-data fields with type as text', () => {
        const props = {
            info: {
                fields: [
                    {
                        advertTemplateInputTypeId: 1,
                        inputType: 0,
                        isDocument: false
                    }
                ]
            }
        }

        expect(new (CategoryInfo as any)(props).getFieldsMetaData()).toEqual({
            1: {
                id: 1,
                type: FIELD_TYPE.TEXT,
                value: EMPTY_FIELD_VALUE
            }
        });
    });

    test('Created CategoryInfo with initialization data of fields with unknown inputType should have meta-data fields with type as text', () => {
        const props = {
            info: {
                fields: [
                    {
                        advertTemplateInputTypeId: 1,
                        inputType: 'unknown input type',
                        isDocument: false
                    }
                ]
            }
        }

        expect(new (CategoryInfo as any)(props).getFieldsMetaData()).toEqual({
            1: {
                id: 1,
                type: FIELD_TYPE.TEXT,
                value: EMPTY_FIELD_VALUE
            }
        });
    });

    test('Created CategoryInfo with initialization data of fields with empty default value should have meta-data fields with EMPTY_FIELD value', () => {
        const props = {
            info: {
                fields: [
                    {
                        advertTemplateInputTypeId: 1,
                        defaultValue: ''
                    }
                ]
            }
        }

        expect(new (CategoryInfo as any)(props).getFieldsMetaData()).toEqual({
            1: {
                id: 1,
                type: FIELD_TYPE.TEXT,
                defaultValue: '',
                value: EMPTY_FIELD_VALUE
            }
        });
    });

    test('Created CategoryInfo with initialization data of fields with default value should have meta-data fields with that default value', () => {
        const props = {
            info: {
                fields: [
                    {
                        advertTemplateInputTypeId: 1,
                        defaultValue: 'default value'
                    }
                ]
            }
        }

        expect(new (CategoryInfo as any)(props).getFieldsMetaData()).toEqual({
            1: {
                id: 1,
                type: FIELD_TYPE.TEXT,
                defaultValue: 'default value',
                value: { ...EMPTY_FIELD_VALUE, str: 'default value' }
            }
        });
    });

    test('Created CategoryInfo with empty initialization data should have empty deadlines', () => {
        expect(new (CategoryInfo as any)().getPublishDateDeadlines()).toEqual({
            daysApart: 0,
            deadlines: []
        });
    });

    test('Created CategoryInfo with initialization data should have certain structured deadlines', () => {
        const props = {
            info: {
                monthDeadlines: [
                    {
                        deadlines: [
                            {
                                available: false,
                                date: "2020-07-01T00:00:00",
                                dayOfWeek: 3,
                                deadlineDate: "2020-06-30T08:00:00",
                                deadlineDayOfWeek: 2,
                                deadlineDescription: "Tuesday",
                                description: "Wednesday"
                            },
                            {
                                available: true,
                                date: "2020-07-09T00:00:00",
                                dayOfWeek: 4,
                                deadlineDate: "2020-07-08T08:00:00",
                                deadlineDayOfWeek: 3,
                                deadlineDescription: "Wednesday",
                                description: "Thursday"
                            }
                        ],
                        monthName: "July",
                        monthNumber: 7,
                        year: 2020
                    }
                ],
                publishDaysApart: 7
            }
        }
        expect(new (CategoryInfo as any)(props).getPublishDateDeadlines()).toEqual({
            daysApart: 7,
            deadlines: [
                {
                    available: false,
                    date: "2020-07-01"
                },
                {
                    available: true,
                    date: "2020-07-09"
                }
            ]
        });
    });
});