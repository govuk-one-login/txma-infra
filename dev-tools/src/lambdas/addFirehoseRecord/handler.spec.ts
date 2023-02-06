import { when } from 'jest-when'
import { jsonToUint8Array } from '../../utils/helpers'
import { handler } from './handler'
import { putFirehoseRecord } from './putFirehoseRecord'

jest.mock('./putFirehoseRecord', () => ({
  putFirehoseRecord: jest.fn()
}))

describe('add firehose record handler', () => {
  const firehose = 'test-firehose-stream'

  const validData = {
    foo: 'bar'
  }

  it('returns record id when called with valid parameters', async () => {
    when(putFirehoseRecord).mockResolvedValue({
      RecordId: '12345',
      $metadata: {}
    })
    const recordId = await handler(firehose, validData)

    expect(putFirehoseRecord).toHaveBeenCalledWith(
      firehose,
      jsonToUint8Array(validData)
    )
    expect(recordId).toEqual('12345')
  })

  it('logs error an error if Firehose command fails', async () => {
    when(putFirehoseRecord).mockRejectedValue(new Error('Some firehose error'))

    await expect(handler(firehose, validData)).rejects.toThrow(
      'Some firehose error'
    )
  })
})
