// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // A preset that is used as a base for Jest's configuration
  preset: '@shelf/jest-mongodb',
  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: './test-setup',
  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: './test-teardown.js',
  setupFiles: ['dotenv/config']
};
