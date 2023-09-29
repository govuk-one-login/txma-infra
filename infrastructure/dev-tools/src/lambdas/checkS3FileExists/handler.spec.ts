import {
  HeadObjectCommand,
  HeadObjectCommandOutput,
  S3Client
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'

import 'aws-sdk-client-mock-jest'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { handler } from './handler'

const s3Mock = mockClient(S3Client)

const testBucket = 'myBucket'
const testKey = 'myKey'

describe('checkS3FileExists handler', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return true if the response from S3 indicates that the file exists', async () => {
    s3Mock.on(HeadObjectCommand).resolves({
      ContentLength: 1
    } as HeadObjectCommandOutput)

    const result = await handler(
      { bucketName: testBucket, key: testKey },
      mockLambdaContext
    )
    expect(result).toEqual(true)
    expect(s3Mock).toHaveReceivedCommandWith(HeadObjectCommand, {
      Bucket: testBucket,
      Key: testKey
    })
  })

  it.each(['AccessDenied', 'NotFound'])(
    'should return false if the response from S3 indicates that the file does not exist',
    async (errorCode: string) => {
      s3Mock.on(HeadObjectCommand).rejects({ name: errorCode })

      const result = await handler(
        { bucketName: testBucket, key: testKey },
        mockLambdaContext
      )
      expect(result).toEqual(false)
    }
  )
})
