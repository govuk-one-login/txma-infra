import { SQSClient } from '@aws-sdk/client-sqs'
import { getEnv } from '../../utils/getEnv.js'

export const sqsClient = new SQSClient({
  region: getEnv('AWS_REGION')
})
