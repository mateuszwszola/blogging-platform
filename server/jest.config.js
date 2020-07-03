// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  setupFiles: ['dotenv/config'],
  verbose: true,
  restoreMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test-db-setup.js'],
  testURL: 'http://localhost/',
  coveragePathIgnorePatterns: ['/node_modules/'],
};
