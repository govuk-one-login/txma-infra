import { vi, describe, test, expect, beforeEach } from 'vitest'
import type { MockedFunction } from 'vitest'
import 'aws-sdk-client-mock-vitest/extend'
import { emptyS3Bucket } from './emptyS3Bucket.js'
import { mockClient } from 'aws-sdk-client-mock'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
})
