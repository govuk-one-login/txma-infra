import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getEnv } from '../../utils/getEnv'
import { logger } from '../../utils/logger'

export const writeTestFileToAthenaOutputBucket = (
  athenaQueryId: string,
  fileContents: string
): Promise<unknown> => {
  const client = new S3Client(getEnv('AWS_REGION'))
  logger.info(`Writing test output file to ${athenaQueryId}.csv`)
  return client.send(
    new PutObjectCommand({
      Key: `ticf-automated-audit-data-queries/${athenaQueryId}.csv`,
      Bucket: getEnv('ATHENA_OUTPUT_BUCKET_NAME'),
      Body: fileContents
    })
  )
}
