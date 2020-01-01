module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/test/setupFilesAfterEnv.ts'],
  transform: {
    '.ts': 'ts-jest'
  },
  testRegex: '\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  modulePathIgnorePatterns: ['/examples/'],
  watchPathIgnorePatterns: ['tmp/', '/generated/*'],
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/test/*', '\\.test\\.ts$'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
};
