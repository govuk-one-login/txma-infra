import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/src/utils/tests/constants/testEnvVars.ts'],
  verbose: true
}

export default config
