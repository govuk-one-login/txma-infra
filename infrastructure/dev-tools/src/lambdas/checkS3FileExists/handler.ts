import { HeadObjectCommand } from '@aws-sdk/client-s3'
import { Context } from 'aws-lambda'
import { s3Client } from '../../sharedServices/s3/s3Client'
import { S3FileDetails } from '../../types/s3FileDetails'
import { initialiseLogger, logger } from '../../utils/logger'

export const handler = async (
  s3FileDetails: S3FileDetails,
  context: Context
) => {
  initialiseLogger(context)
  logger.info('Received request to check if file exists', { s3FileDetails })
  const doesFileExist = await s3FileExists(s3FileDetails)
  logger.info('File existence result', { doesFileExist })
  return doesFileExist
}

const s3FileExists = async (s3FileDetails: S3FileDetails): Promise<boolean> => {
  try {
    const headObjectResponse = await s3Client.send(
      new HeadObjectCommand({
        Bucket: s3FileDetails.bucketName,
        Key: s3FileDetails.key
      })
    )

    return !!headObjectResponse.ContentLength
  } catch (err) {
    const notFoundError = err as { name: string }
    if (
      notFoundError &&
      // Depending on the permissions, we can either get AccessDenied or NotFound when a file doesn't
      ['AccessDenied', 'NotFound'].includes(notFoundError.name)
    ) {
      return false
    }
    throw err
  }
}
