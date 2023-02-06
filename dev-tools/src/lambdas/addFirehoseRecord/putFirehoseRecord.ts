import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'

export const putFirehoseRecord = async (firehose: string, data: Uint8Array) => {
  const client = new FirehoseClient({ region: 'REGION' })

  const input = {
    DeliveryStreamName: firehose,
    Record: { Data: data }
  }

  return await client.send(new PutRecordCommand(input))
}
