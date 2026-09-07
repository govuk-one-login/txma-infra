import { vi, describe, it, expect, beforeEach } from 'vitest'
import 'aws-sdk-client-mock-vitest/extend'
import {
  CopyObjectCommand,
  S3Client,
  StorageClass,
  CopyObjectCommandInput
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext.js'
import { handler } from './handler.js'

vi.mock('../../utils/logger.js', () => ({
  initialiseLogger: vi.fn(),
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }
}))
vi.mock('../../utils/errorCodes.js', () => ({
  ERROR_CODES: { DT008: 'DT008' }
}))

const s3Mock = mockClient(S3Client)

const testBucket = 'myBucket'
const testSourceKey = 'myOtherBucket/myFile.gz'
const testKey = 'myKey'

describe('copyS3File handler', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should pass the correct parameters on to the CopyCommand', async () => {
    const testInput = {
      Bucket: testBucket,
      CopySource: testSourceKey,
      Key: testKey,
      StorageClass: StorageClass.STANDARD,
      Tagging: 'autoTest=true',
      TaggingDirective: 'REPLACE'
    } as CopyObjectCommandInput

    await handler(testInput, mockLambdaContext)
    expect(s3Mock).toHaveReceivedCommandWith(
      CopyObjectCommand,
      testInput as unknown as Record<string, unknown>
    )
  })
})
