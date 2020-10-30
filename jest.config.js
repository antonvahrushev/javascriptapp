const {defaults} = require('jest-config');

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
};