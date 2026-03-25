import { vi } from 'vitest'
import { describe, it, expect } from 'vitest'
import { S3FileDetails } from '../../types/s3FileDetails.js'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext.js'
import { handler } from './handler.js'
import { s3DownloadFileToString } from './s3DownloadFileToString.js'

vi.mock('./s3DownloadFileToString.js', () => ({
  s3DownloadFileToString: vi.fn()
}))

describe('Read s3 file to string handler', () => {
  it('returns error with invalid parameters', async () => {
    await expect(
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
    vi.mocked(s3DownloadFileToString).mockResolvedValue(testFileContents)

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
