/// <reference types="vitest/globals" />

import type { CustomMatcher } from 'aws-sdk-client-mock-vitest'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<R = void> extends CustomMatcher<R> {}
}
