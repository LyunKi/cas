import type { Config } from 'jest'

export default {
  preset: 'ts-jest',
  moduleNameMapper: {
    '@cas-server/(.*)$': '<rootDir>/src/$1',
  },
} as Config
