import { Context } from 'aws-lambda'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { s3Client } from '../../sharedServices/s3/s3Client.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { PutZippedStringParameters } from '../../types/putZippedStringParameters.js'
import { gzipSync } from 'zlib'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (
  parameters: PutZippedStringParameters,
  context: Context
) => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', {
    bucket: parameters.bucket,
    key: parameters.key
  })

  try {
    const response = await s3Client.send(
      new PutObjectCommand({
        Key: parameters.key,
        Bucket: parameters.bucket,
        Body: gzipSync(parameters.data),
        StorageClass: parameters.storageClass,
        ContentEncoding: 'gzip'
      })
    )

    logger.info('Handler completed', {
      outcome: 'success',
      duration: Date.now() - startTime,
      bucket: parameters.bucket,
      key: parameters.key,
      versionId: response.VersionId
    })

    return response
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Handler failed', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT009,
        message: err.message,
        name: err.name,
        stack: err.stack
      }
    })
    throw error
  }
}
