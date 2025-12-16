/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend/tests'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  // Needed for TypeORM decorators in tests.
  setupFiles: ['reflect-metadata'],
  globals: {
    'ts-jest': {
      tsconfig: 'backend/tsconfig.json',
    },
  },
};
