import { vi, describe, it, expect, beforeEach } from 'vitest'
import 'aws-sdk-client-mock-vitest/extend'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import { Readable } from 'stream'
import { s3DownloadFileToString } from './s3DownloadFileToString.js'
import { StreamingBlobPayloadOutputTypes } from '@smithy/types'

const s3Mock = mockClient(S3Client)
const testS3Data = 'some data'

const createDataStream = () => {
  const dataStream = new Readable()
  dataStream.push(testS3Data)
  dataStream.push(null)
  return dataStream
}

const givenDataIsAvailable = () => {
  s3Mock
    .on(GetObjectCommand)
    .resolves({ Body: createDataStream() as StreamingBlobPayloadOutputTypes })
}

const givenFileDoesNotExist = () => {
  s3Mock.on(GetObjectCommand).rejects({ name: 'NoSuchKey' })
}

const givenGenericErrorDownloadingFile = () => {
  s3Mock.on(GetObjectCommand).rejects({ name: 'SomeOtherError' })
}

describe('readS3DataToString', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  const testBucket = 'myTestBucket'
  const testKey = 'myTestKey'

  it('returns a string read from the file', async () => {
    givenDataIsAvailable()

    const returnedData = await s3DownloadFileToString(testBucket, testKey)

    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: testBucket,
      Key: testKey
    })
    expect(returnedData).toEqual(testS3Data)
  })

  it('returns undefined if the file is not found', async () => {
    givenFileDoesNotExist()
    const returnedData = await s3DownloadFileToString(testBucket, testKey)
    expect(returnedData).toBeUndefined()
  })

  it('throws if there is another error downloading the data', async () => {
    givenGenericErrorDownloadingFile()
    await expect(s3DownloadFileToString(testBucket, testKey)).rejects.toThrow()
  })
})
