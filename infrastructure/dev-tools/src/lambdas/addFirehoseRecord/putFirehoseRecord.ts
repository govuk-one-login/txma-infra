import { PutRecordCommand } from '@aws-sdk/client-firehose'
import { firehoseClient } from './firehoseClient.js'

export const putFirehoseRecord = async (firehose: string, data: Uint8Array) => {
  const input = {
    DeliveryStreamName: firehose,
    Record: { Data: data }
  }

  return await firehoseClient.send(new PutRecordCommand(input))
}
