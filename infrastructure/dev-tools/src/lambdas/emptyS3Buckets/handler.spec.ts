import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import type { MockedFunction, MockInstance } from 'vitest'
import { CloudFormationCustomResourceUpdateEvent } from 'aws-lambda'
import { emptyS3Bucket } from './emptyS3Bucket.js'
import { listS3Buckets } from './listS3Buckets.js'
import { defaultCustomResourceDeleteEvent } from '../../utils/tests/events/defaultCustomResourceDeleteEvent.js'
import { handler } from './handler.js'
import axios from 'axios'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext.js'

vi.mock('./listS3Buckets.js', () => ({
  listS3Buckets: vi.fn()
}))

vi.mock('./emptyS3Bucket.js', () => ({
  emptyS3Bucket: vi.fn()
}))

const mockListS3Buckets = listS3Buckets as MockedFunction<typeof listS3Buckets>
const mockEmptyS3Bucket = emptyS3Bucket as MockedFunction<typeof emptyS3Bucket>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let httpsRequestSpy: MockInstance<(...args: any[]) => any>

const successPayload = {
  PhysicalResourceId: defaultCustomResourceDeleteEvent.PhysicalResourceId,
  StackId: defaultCustomResourceDeleteEvent.StackId,
  RequestId: defaultCustomResourceDeleteEvent.RequestId,
  LogicalResourceId: defaultCustomResourceDeleteEvent.LogicalResourceId,
  Status: 'SUCCESS'
}

describe('empty s3 buckets handler', () => {
  const givenNoS3Buckets = () => {
    mockListS3Buckets.mockResolvedValue([])
  }

  const givenS3Buckets = () => {
    mockListS3Buckets.mockResolvedValue(['example-bucket'])
  }

  beforeEach(() => {
    httpsRequestSpy = vi.spyOn(axios, 'put').mockResolvedValue({})
  })

  afterEach(() => {
    httpsRequestSpy.mockClear()
  })

  test('does nothing if event type is not delete', async () => {
    const updateEvent = {
      ...defaultCustomResourceDeleteEvent,
      RequestType: 'Update'
    } as CloudFormationCustomResourceUpdateEvent

    await handler(updateEvent, mockLambdaContext)

    expect(httpsRequestSpy).toHaveBeenCalledWith(
      expect.anything(),
      successPayload
    )
  })

  test('does nothing if stack contains no s3 buckets', async () => {
    givenNoS3Buckets()

    await handler(defaultCustomResourceDeleteEvent, mockLambdaContext)

    expect(httpsRequestSpy).toHaveBeenCalledWith(
      expect.anything(),
      successPayload
    )
  })

  test('calls empty bucket if stack contains s3 buckets', async () => {
    givenS3Buckets()
    mockEmptyS3Bucket.mockImplementationOnce(() => Promise.resolve())

    await handler(defaultCustomResourceDeleteEvent, mockLambdaContext)

    expect(httpsRequestSpy).toHaveBeenCalledWith(
      expect.anything(),
      successPayload
    )
    expect(emptyS3Bucket).toHaveBeenCalledWith('example-bucket')
  })

  test('sends error payload when error emptying buckets', async () => {
    givenS3Buckets()
    mockEmptyS3Bucket.mockImplementationOnce(() => {
      throw new Error('error message')
    })

    await handler(defaultCustomResourceDeleteEvent, mockLambdaContext)

    const errorPayload = {
      ...successPayload,
      Status: 'FAILED',
      Reason: 'error message'
    }

    expect(httpsRequestSpy).toHaveBeenCalledWith(
      expect.anything(),
      errorPayload
    )
  })
})
