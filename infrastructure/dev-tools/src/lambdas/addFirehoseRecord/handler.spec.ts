import { vi, describe, it, expect } from 'vitest'
import { jsonToUint8Array } from '../../utils/helpers.js'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext.js'
import { handler } from './handler.js'
import { putFirehoseRecord } from './putFirehoseRecord.js'

vi.mock('./putFirehoseRecord.js', () => ({
  putFirehoseRecord: vi.fn()
}))

describe('add firehose record handler', () => {
  const params = {
    firehose: 'test-firehose-stream',
    data: {
      foo: 'bar'
    }
  }

  it('returns record id when called with valid parameters', async () => {
    vi.mocked(putFirehoseRecord).mockResolvedValue({
      RecordId: '12345',
      $metadata: {}
    })
    const recordId = await handler(params, mockLambdaContext)

    expect(putFirehoseRecord).toHaveBeenCalledWith(
      params.firehose,
      jsonToUint8Array(params.data)
    )
    expect(recordId).toEqual('12345')
  })

  it('logs error an error if Firehose command fails', async () => {
    vi.mocked(putFirehoseRecord).mockRejectedValue(
      new Error('Some firehose error')
    )

    await expect(handler(params, mockLambdaContext)).rejects.toThrow(
      'Some firehose error'
    )
  })
})
