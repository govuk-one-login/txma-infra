import { SQSClient } from '@aws-sdk/client-sqs'

export const sqsClient = new SQSClient({
  region: process.env['AWS_REGION']
})
