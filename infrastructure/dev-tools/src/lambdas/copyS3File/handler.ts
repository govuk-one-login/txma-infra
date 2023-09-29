import { CopyObjectCommand, CopyObjectCommandInput } from '@aws-sdk/client-s3'
import { Context } from 'aws-lambda'
import { initialiseLogger, logger } from '../../utils/logger'
import { s3Client } from '../../sharedServices/s3/s3Client'

export const handler = async (
  copyObjectCommandInput: CopyObjectCommandInput,
  context: Context
) => {
  initialiseLogger(context)
  await copyFile(copyObjectCommandInput)
  logger.info('Completed copy of S3 file', { copyObjectCommandInput })
}

const copyFile = (input: CopyObjectCommandInput) => {
  const command = new CopyObjectCommand(input)

  try {
    return s3Client.send(command)
  } catch (error) {
    throw new Error(
      `Failed to copy from ${input.CopySource} to bucket ${input.Bucket}`,
      {
        cause: error
      }
    )
  }
}
