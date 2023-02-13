import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  coveragePathIgnorePatterns: ['/.yarn/', '/dist/'],
  preset: 'ts-jest',
  verbose: true,
  setupFiles: ['<rootDir>/src/utils/tests/setup/testEnvVars.ts']
}

export default config
