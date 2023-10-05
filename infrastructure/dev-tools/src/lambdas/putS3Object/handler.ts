import {
    PutObjectCommandInput,
    PutObjectCommand
  } from '@aws-sdk/client-s3'
import { initialiseLogger, logger } from '../../utils/logger'
import { Context } from 'aws-lambda'
import { putS3Object } from './putS3Object'
import { s3Client } from '../../sharedServices/s3/s3Client'
  
export const handler = async (
  putObjectCommandInput: PutObjectCommandInput,
  context: Context 
) => {
    initialiseLogger(context) 

    try {
    await putS3Object(putObjectCommandInput)
    logger.info('Completed put of s3 file', {PutObjectCommandInput})
    } catch (error) {
      throw new Error(
        `Error putting s3 file into ${PutObjectCommandInput.Bucket}`
      )
    }

    try {
    const command = new PutObjectCommand(putObjectCommandInput)
    return await s3Client.send(command)
    } catch (error) {
      throw new Error(
        `Failed to put ${PutObjectCommandInput.fileKey} to bucket ${PutObjectCommandInput.bucket}`
      )
    }
  }

  