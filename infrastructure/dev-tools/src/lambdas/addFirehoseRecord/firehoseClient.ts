import { FirehoseClient } from '@aws-sdk/client-firehose'
import { getEnv } from '../../utils/getEnv.js'

export const firehoseClient = new FirehoseClient({
  region: getEnv('AWS_REGION')
})
