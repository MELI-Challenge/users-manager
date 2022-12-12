/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  setupFiles: ['dotenv/config'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@infrastructure/(.*)$': '<rootDir>/app/infrastructure/$1',
    '^@database/(.*)$': '<rootDir>/app/infrastructure/database/$1'
  },
  rootDir: 'src',
  bail: 1,
  verbose: true,
  globals: {
    'ts-jest': {
      astTransformers: {
        before: ['ts-nameof']
      }
    }
  },
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/utils/result.ts',
    '!./index.ts',
    '!**/utils/response_errors.ts',
    '!**/utils/gracefulshutdown.ts',
    '!**/infrastructure/database/mocks/index.d.ts'
  ],
  coveragePathIgnorePatterns: ['.*__snapshots__/.*'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
