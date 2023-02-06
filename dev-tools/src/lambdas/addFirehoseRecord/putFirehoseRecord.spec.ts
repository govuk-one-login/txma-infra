import { mockClient } from 'aws-sdk-client-mock'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'
import { putFirehoseRecord } from './putFirehoseRecord'
import { jsonToUint8Array } from '../../utils/helpers'
import 'aws-sdk-client-mock-jest'

const firehoseMock = mockClient(FirehoseClient)

describe('add firehose record', () => {
  test('firehose client is called with the correct parameters', async () => {
    const data = {
      foo: 'bar'
    }

    const input = {
      DeliveryStreamName: 'test-firehose-stream',
      Record: { Data: jsonToUint8Array(data) }
    }

    await putFirehoseRecord(input.DeliveryStreamName, input.Record.Data)

    expect(firehoseMock).toHaveReceivedCommandWith(PutRecordCommand, input)
  })
})
