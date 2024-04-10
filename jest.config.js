/** @type {import('jest').Config} */
const config = {
  collectCoverage: false,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1'
  },

  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // A map from regular expressions to paths to transformers
  transform: {
    '\\.ts$': 'ts-jest'
  }
}

module.exports = config