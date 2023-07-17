import { FirehoseClient } from '@aws-sdk/client-firehose'

export const firehoseClient = new FirehoseClient({
  region: process.env['AWS_REGION']
})
