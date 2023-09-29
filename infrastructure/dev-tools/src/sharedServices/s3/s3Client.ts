import { S3Client } from '@aws-sdk/client-s3'
import { getEnv } from '../../utils/getEnv'

export const s3Client = new S3Client({ region: getEnv('AWS_REGION') })
