import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'stream'
import consumers from 'stream/consumers'
import { logger } from '../../utils/logger'

export const s3DownloadFileToString = async (
  bucketName: string,
  fileKey: string
): Promise<string | undefined> => {
  const commandInput = {
    Bucket: bucketName,
    Key: fileKey
  }
  logger.info(`Trying to read file ${fileKey} in bucket ${bucketName}`)
  const s3Client = new S3Client({ region: process.env['AWS_REGION'] })
  try {
    const { Body } = await s3Client.send(new GetObjectCommand(commandInput))
    return consumers.text(Body as Readable)
  } catch (error) {
    const notFoundError = error as { name: string }
    if (notFoundError && notFoundError.name === 'NoSuchKey') {
      return undefined
    }
    throw error
  }
}
