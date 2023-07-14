import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'

import 'aws-sdk-client-mock-jest'
import { Readable } from 'stream'
import { s3DownloadFileToString } from './s3DownloadFileToString'

const s3Mock = mockClient(S3Client)
const testS3Data = 'some data'

const createDataStream = () => {
  const dataStream = new Readable()
  dataStream.push(testS3Data)
  dataStream.push(null)
  return dataStream
}

const givenDataIsAvailable = () => {
  s3Mock.on(GetObjectCommand).resolves({ Body: createDataStream() })
}

const givenFileDoesNotExist = () => {
  s3Mock.on(GetObjectCommand).rejects({ name: 'NoSuchKey' })
}

const givenGenericErrorDownloadingFile = () => {
  s3Mock.on(GetObjectCommand).rejects({ name: 'SomeOtherError' })
}

describe('readS3DataToString', () => {
  beforeEach(() => {
    jest.resetAllMocks()
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
    expect(s3DownloadFileToString(testBucket, testKey)).rejects.toThrow()
  })
})
