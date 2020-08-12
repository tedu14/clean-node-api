module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  coverageReporters: [
    'text-summary',
    'lcov'
  ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts']
}
