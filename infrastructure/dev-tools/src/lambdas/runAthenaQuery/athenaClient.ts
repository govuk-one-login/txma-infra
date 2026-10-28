import { AthenaClient } from '@aws-sdk/client-athena'
import { getEnv } from '../../utils/getEnv.js'

export const athenaClient = new AthenaClient({ region: getEnv('AWS_REGION') })
