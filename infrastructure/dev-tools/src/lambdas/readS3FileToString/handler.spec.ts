import { when } from 'jest-when'
import { S3FileDetails } from '../../types/s3FileDetails'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { handler } from './handler'
import { s3DownloadFileToString } from './s3DownloadFileToString'

jest.mock('./s3DownloadFileToString', () => ({
  s3DownloadFileToString: jest.fn()
}))

describe('Read s3 file to string handler', () => {
  it('returns error with invalid parameters', async () => {
    expect(
      handler(
        { invalid: 'test' } as unknown as S3FileDetails,
        mockLambdaContext
      )
    ).rejects.toThrow('Function called with invalid parameters')
  })

  it('Passes the correct data to s3DownloadFileToString', async () => {
    const testBucketName = 'myBucketName'
    const testFileKey = 'myFileKey'
    const testFileContents = 'my file contents'
    when(s3DownloadFileToString).mockResolvedValue(testFileContents)

    const result = await handler(
      { bucketName: testBucketName, key: testFileKey },
      mockLambdaContext
    )

    expect(result).toEqual(testFileContents)
    expect(s3DownloadFileToString).toHaveBeenCalledWith(
      testBucketName,
      testFileKey
    )
  })
})
