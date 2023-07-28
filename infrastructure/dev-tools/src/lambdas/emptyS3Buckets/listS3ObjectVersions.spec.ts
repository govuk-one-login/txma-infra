import { mockClient } from 'aws-sdk-client-mock'
import { listS3ObjectVersions } from './listS3ObjectVersions'
import {
  S3Client,
  ListObjectVersionsCommand,
  ListObjectVersionsCommandInput
} from '@aws-sdk/client-s3'
import {
  TEST_KEY,
  TEST_VERSION_ID
} from '../../utils/tests/constants/testConstants'
import 'aws-sdk-client-mock-jest'

const s3Mock = mockClient(S3Client)

describe('list S3 objects', () => {
  const input: ListObjectVersionsCommandInput = {
    Bucket: 'example-bucket'
  }

  beforeEach(() => {
    s3Mock.reset()
  })

  test('response has versions and delete markers', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      DeleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
      Versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }]
    })

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandWith(ListObjectVersionsCommand, input)
    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 1)
    expect(result).toEqual({
      deleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
      versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }]
    })
  })

  test('response has no delete markers but does have versions', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      Versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }]
    })

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandWith(ListObjectVersionsCommand, input)
    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 1)
    expect(result).toEqual({
      deleteMarkers: [],
      versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }]
    })
  })

  test('response has no versions but does have delete markers', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({
      DeleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }]
    })

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandWith(ListObjectVersionsCommand, input)
    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 1)
    expect(result).toEqual({
      deleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
      versions: []
    })
  })

  test('response has no delete markers or versions', async () => {
    s3Mock.on(ListObjectVersionsCommand).resolves({})

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandWith(ListObjectVersionsCommand, input)
    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 1)
    expect(result).toEqual({ deleteMarkers: [], versions: [] })
  })

  test('response has NextKeyMarker', async () => {
    s3Mock
      .on(ListObjectVersionsCommand)
      .resolvesOnce({
        Versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
        DeleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
        IsTruncated: true,
        NextKeyMarker: TEST_KEY + 1
      })
      .resolves({
        DeleteMarkers: [{ Key: TEST_KEY + 1, VersionId: TEST_VERSION_ID + 1 }]
      })

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 2)
    expect(s3Mock).toHaveReceivedNthCommandWith(
      1,
      ListObjectVersionsCommand,
      input
    )
    expect(s3Mock).toHaveReceivedNthCommandWith(2, ListObjectVersionsCommand, {
      ...input,
      KeyMarker: TEST_KEY + 1
    })
    expect(result).toEqual({
      deleteMarkers: [
        { Key: TEST_KEY, VersionId: TEST_VERSION_ID },
        { Key: TEST_KEY + 1, VersionId: TEST_VERSION_ID + 1 }
      ],
      versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }]
    })
  })

  test('response has NextVersionIdMarker', async () => {
    s3Mock
      .on(ListObjectVersionsCommand)
      .resolvesOnce({
        Versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
        DeleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
        IsTruncated: true,
        NextVersionIdMarker: TEST_VERSION_ID + 1
      })
      .resolves({
        Versions: [{ Key: TEST_KEY + 1, VersionId: TEST_VERSION_ID + 1 }]
      })

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 2)
    expect(s3Mock).toHaveReceivedNthCommandWith(
      1,
      ListObjectVersionsCommand,
      input
    )
    expect(s3Mock).toHaveReceivedNthCommandWith(2, ListObjectVersionsCommand, {
      ...input,
      VersionIdMarker: TEST_VERSION_ID + 1
    })
    expect(result).toEqual({
      deleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
      versions: [
        { Key: TEST_KEY, VersionId: TEST_VERSION_ID },
        { Key: TEST_KEY + 1, VersionId: TEST_VERSION_ID + 1 }
      ]
    })
  })

  test('response has both NextKeyMarker and NextVersionIdMarker', async () => {
    s3Mock
      .on(ListObjectVersionsCommand)
      .resolvesOnce({
        Versions: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
        DeleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
        IsTruncated: true,
        NextKeyMarker: TEST_KEY + 1,
        NextVersionIdMarker: TEST_VERSION_ID + 1
      })
      .resolves({
        Versions: [{ Key: TEST_KEY + 1, VersionId: TEST_VERSION_ID + 1 }]
      })

    const result = await listS3ObjectVersions(input)

    expect(s3Mock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 2)
    expect(s3Mock).toHaveReceivedNthCommandWith(
      1,
      ListObjectVersionsCommand,
      input
    )
    expect(s3Mock).toHaveReceivedNthCommandWith(2, ListObjectVersionsCommand, {
      ...input,
      VersionIdMarker: TEST_VERSION_ID + 1
    })
    expect(result).toEqual({
      deleteMarkers: [{ Key: TEST_KEY, VersionId: TEST_VERSION_ID }],
      versions: [
        { Key: TEST_KEY, VersionId: TEST_VERSION_ID },
        { Key: TEST_KEY + 1, VersionId: TEST_VERSION_ID + 1 }
      ]
    })
  })
})
