import { when } from 'jest-when'
import { jsonToUint8Array } from '../../utils/helpers'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { handler } from './handler'
import { putFirehoseRecord } from './putFirehoseRecord'

jest.mock('./putFirehoseRecord', () => ({
  putFirehoseRecord: jest.fn()
}))

describe('add firehose record handler', () => {
  const params = {
    firehose: 'test-firehose-stream',
    data: {
      foo: 'bar'
    }
  }

  it('returns record id when called with valid parameters', async () => {
    when(putFirehoseRecord).mockResolvedValue({
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
    when(putFirehoseRecord).mockRejectedValue(new Error('Some firehose error'))

    await expect(handler(params, mockLambdaContext)).rejects.toThrow(
      'Some firehose error'
    )
  })
})
