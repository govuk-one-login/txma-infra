import { Context } from 'aws-lambda'
import { initialiseLogger, logger } from '../../utils/logger'
import { s3Client } from '../../sharedServices/s3/s3Client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { PutZippedStringParameters } from '../../types/putZippedStringParameters'
import { gzipSync } from 'zlib'

export const handler = async (
  parameters: PutZippedStringParameters,
  context: Context
) => {
  initialiseLogger(context)
  logger.info('Received s3 PUT for zipped data', { parameters })
  const response = await s3Client.send(
    new PutObjectCommand({
      Key: parameters.key,
      Bucket: parameters.bucket,
      Body: gzipSync(parameters.data),
      StorageClass: parameters.storageClass,
      ContentEncoding: 'gzip'
    })
  )
  logger.info('Completed s3 PUT of zipped data', {
    parameters,
    response
  })
  return response
}
