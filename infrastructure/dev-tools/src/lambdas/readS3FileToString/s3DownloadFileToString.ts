import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import consumers from 'stream/consumers'
import { logger } from '../../utils/logger.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const s3DownloadFileToString = async (
  bucketName: string,
  fileKey: string
): Promise<string | undefined> => {
  logger.info('Attempting to read S3 file', { bucketName, fileKey })

  const s3Client = new S3Client({
    ...(process.env['AWS_REGION'] && { region: process.env['AWS_REGION'] })
  })

  try {
    const { Body } = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: fileKey })
    )
    return consumers.text(Body as Readable)
  } catch (error) {
    const typedError = error as { name: string; message?: string }
    if (typedError && typedError.name === 'NoSuchKey') {
      logger.warn('S3 file not found', {
        error: {
          code: ERROR_CODES.DT003,
          message: typedError.message,
          name: typedError.name
        },
        bucketName,
        fileKey
      })
      return undefined
    }
    throw error
  }
}
