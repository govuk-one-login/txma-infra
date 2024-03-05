import {
  CopyObjectCommand,
  S3Client,
  StorageClass,
  CopyObjectCommandInput
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'

import 'aws-sdk-client-mock-jest'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { handler } from './handler'

const s3Mock = mockClient(S3Client)

const testBucket = 'myBucket'
const testSourceKey = 'myOtherBucket/myFile.gz'
const testKey = 'myKey'

describe('copyS3File handler', () => {
  beforeEach(() => {
    jest.resetAllMocks()
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
    expect(s3Mock).toHaveReceivedCommandWith(CopyObjectCommand, testInput)
  })
})
