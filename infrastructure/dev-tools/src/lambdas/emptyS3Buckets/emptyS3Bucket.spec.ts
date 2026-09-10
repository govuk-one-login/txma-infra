import { vi, describe, test, expect, beforeEach } from 'vitest'
import type { MockedFunction } from 'vitest'
import 'aws-sdk-client-mock-vitest/extend'
import { emptyS3Bucket } from './emptyS3Bucket.js'
import { mockClient } from 'aws-sdk-client-mock'
import {
  DeleteObjectCommand,
  HeadBucketCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { listS3ObjectVersions } from './listS3ObjectVersions.js'
import {
  TEST_KEY,
  TEST_LIST_OF_S3_OBJECT_VERSIONS,
  TEST_VERSION_ID
} from '../../utils/tests/constants/testConstants.js'

const s3Mock = mockClient(S3Client)

vi.mock('./listS3ObjectVersions.js', () => ({
  listS3ObjectVersions: vi.fn()
}))
const mockListS3ObjectVersions = listS3ObjectVersions as MockedFunction<
  typeof listS3ObjectVersions
>

const bucketName = 'example-bucket'

describe('emptyS3Bucket', () => {
  beforeEach(() => {
    s3Mock.reset()
    mockListS3ObjectVersions.mockReset()
    s3Mock.on(HeadBucketCommand).resolves({})
  })

  test('delete object command is called for each version and delete marker', async () => {
    mockListS3ObjectVersions.mockResolvedValue(TEST_LIST_OF_S3_OBJECT_VERSIONS)
    s3Mock.on(DeleteObjectCommand).resolves({})

    await emptyS3Bucket(bucketName)

    expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
      Bucket: bucketName,
      Key: TEST_KEY,
      VersionId: TEST_VERSION_ID
    })
    expect(s3Mock).toHaveReceivedCommandTimes(
      DeleteObjectCommand,
      TEST_LIST_OF_S3_OBJECT_VERSIONS.versions.length +
        TEST_LIST_OF_S3_OBJECT_VERSIONS.deleteMarkers.length
    )
  })

  test('delete object command is called for versions when delete markers not present', async () => {
    const listOfObjectVersionsWithNoDeleteMarkers = {
      ...TEST_LIST_OF_S3_OBJECT_VERSIONS
    }
    listOfObjectVersionsWithNoDeleteMarkers.deleteMarkers = []
    mockListS3ObjectVersions.mockResolvedValue(
      listOfObjectVersionsWithNoDeleteMarkers
    )
    s3Mock.on(DeleteObjectCommand).resolves({})

    await emptyS3Bucket(bucketName)

    expect(s3Mock).toHaveReceivedCommandTimes(
      DeleteObjectCommand,
      listOfObjectVersionsWithNoDeleteMarkers.versions.length
    )
  })

  test('delete object command is called for delete markers when versions not present', async () => {
    const listOfObjectVersionsWithNoDeleteMarkers = {
      ...TEST_LIST_OF_S3_OBJECT_VERSIONS
    }
    listOfObjectVersionsWithNoDeleteMarkers.versions = []
    mockListS3ObjectVersions.mockResolvedValue(
      listOfObjectVersionsWithNoDeleteMarkers
    )
    s3Mock.on(DeleteObjectCommand).resolves({})

    await emptyS3Bucket(bucketName)

    expect(s3Mock).toHaveReceivedCommandTimes(
      DeleteObjectCommand,
      listOfObjectVersionsWithNoDeleteMarkers.deleteMarkers.length
    )
  })

  test('No objects in versioned s3 bucket', async () => {
    mockListS3ObjectVersions.mockResolvedValue({
      versions: [],
      deleteMarkers: []
    })
    s3Mock.on(DeleteObjectCommand).resolves({})

    await emptyS3Bucket(bucketName)

    expect(s3Mock).toHaveReceivedCommandTimes(DeleteObjectCommand, 0)
  })

  test('bucket does not exist (NotFound), skips listing and deleting objects', async () => {
    const notFoundError = new Error('The specified bucket does not exist')
    notFoundError.name = 'NotFound'
    s3Mock.on(HeadBucketCommand).rejects(notFoundError)

    await emptyS3Bucket(bucketName)

    expect(mockListS3ObjectVersions).not.toHaveBeenCalled()
    expect(s3Mock).toHaveReceivedCommandTimes(DeleteObjectCommand, 0)
  })

  test('bucket does not exist (404 status code), skips listing and deleting objects', async () => {
    const notFoundError = Object.assign(new Error('Not Found'), {
      name: 'SomeOtherName',
      $metadata: { httpStatusCode: 404 }
    })
    s3Mock.on(HeadBucketCommand).rejects(notFoundError)

    await emptyS3Bucket(bucketName)

    expect(mockListS3ObjectVersions).not.toHaveBeenCalled()
    expect(s3Mock).toHaveReceivedCommandTimes(DeleteObjectCommand, 0)
  })

  test('permission denied (403 Forbidden), rethrows and does not delete objects', async () => {
    const forbiddenError = Object.assign(new Error('Forbidden'), {
      name: 'Forbidden',
      $metadata: { httpStatusCode: 403 }
    })
    s3Mock.on(HeadBucketCommand).rejects(forbiddenError)

    await expect(emptyS3Bucket(bucketName)).rejects.toThrow('Forbidden')

    expect(mockListS3ObjectVersions).not.toHaveBeenCalled()
    expect(s3Mock).toHaveReceivedCommandTimes(DeleteObjectCommand, 0)
  })
})
