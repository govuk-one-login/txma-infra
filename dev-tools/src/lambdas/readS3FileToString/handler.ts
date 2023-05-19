import { Context } from 'aws-lambda'
import { S3FileDetails } from '../../types/s3FileDetails'
import { initialiseLogger, logger } from '../../utils/logger'
import { s3DownloadFileToString } from './s3DownloadFileToString'

export const handler = async (
  params: S3FileDetails,
  context: Context
): Promise<string | undefined> => {
  initialiseLogger(context)
  if (!params?.bucketName || !params?.key)
    throw Error('Function called with invalid parameters')

  logger.info('Reading file', {
    bucketName: params.bucketName,
    key: params.key
  })
  return s3DownloadFileToString(params.bucketName, params.key)
}
