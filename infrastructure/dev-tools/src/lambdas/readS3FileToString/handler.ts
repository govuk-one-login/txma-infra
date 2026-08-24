import { Context } from 'aws-lambda'
import { S3FileDetails } from '../../types/s3FileDetails.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { s3DownloadFileToString } from './s3DownloadFileToString.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (
  params: S3FileDetails,
  context: Context
): Promise<string | undefined> => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', {
    bucketName: params?.bucketName,
    key: params?.key
  })

  if (!params?.bucketName || !params?.key) {
    logger.error('Handler failed due to invalid parameters', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT002,
        message: 'Function called with invalid parameters'
      }
    })
    throw Error('Function called with invalid parameters')
  }

  const result = await s3DownloadFileToString(params.bucketName, params.key)

  logger.info('Handler completed', {
    outcome: 'success',
    duration: Date.now() - startTime
  })

  return result
}
