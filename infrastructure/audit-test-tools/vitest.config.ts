import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [
      './src/utils/tests/setup/testEnvVars.ts',
      'aws-sdk-client-mock-vitest/extend'
    ],
    coverage: {
      provider: 'v8',
      exclude: ['**/dist/**']
    }
  }
})
