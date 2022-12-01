export default {
  preset: 'ts-jest',
  moduleNameMapper: {
    '@cas-server/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ["<rootDir>/scripts/setup.jest.js"],
  globals: {
    'ts-jest': {
      tsconfig: 'tests/tsconfig.json',
    },
  },
} 
