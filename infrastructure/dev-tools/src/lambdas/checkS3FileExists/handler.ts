import { HeadObjectCommand } from '@aws-sdk/client-s3'
import { Context } from 'aws-lambda'
import { s3Client } from '../../sharedServices/s3/s3Client.js'
import { S3FileDetails } from '../../types/s3FileDetails.js'
import { initialiseLogger, logger } from '../../utils/logger.js'

export const handler = async (
  s3FileDetails: S3FileDetails,
  context: Context
) => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', {
    bucketName: s3FileDetails.bucketName,
    key: s3FileDetails.key
  })

  const doesFileExist = await s3FileExists(s3FileDetails)

  logger.info('Handler completed', {
    outcome: 'success',
    duration: Date.now() - startTime,
    fileExists: doesFileExist
  })

  return { fileExists: doesFileExist }
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
      ['AccessDenied', 'NotFound'].includes(notFoundError.name)
    ) {
      return false
    }
    throw err
  }
}
