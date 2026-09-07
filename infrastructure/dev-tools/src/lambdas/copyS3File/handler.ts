import { CopyObjectCommand, CopyObjectCommandInput } from '@aws-sdk/client-s3'
import { Context } from 'aws-lambda'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { s3Client } from '../../sharedServices/s3/s3Client.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (
  copyObjectCommandInput: CopyObjectCommandInput,
  context: Context
) => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', {
    sourceBucket: copyObjectCommandInput.CopySource,
    destinationBucket: copyObjectCommandInput.Bucket,
    key: copyObjectCommandInput.Key
  })

  try {
    await copyFile(copyObjectCommandInput)

    logger.info('Handler completed', {
      outcome: 'success',
      duration: Date.now() - startTime
    })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Handler failed', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT008,
        message: err.message,
        name: err.name,
        stack: err.stack
      }
    })
    throw error
  }
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
