import {
    PutObjectCommand,
    PutObjectCommandInput
  } from '@aws-sdk/client-s3'
import { s3Client } from '../../sharedServices/s3/s3Client';

export const putS3Object = async (
    input: PutObjectCommandInput
  ): Promise<void> => {
    const command = new PutObjectCommand(input);
  
    try {
    await s3Client.send(command)
    } catch (error) {
      throw new Error(
        `Failed to put ${input.Key} to ${input.Bucket}`
      )
    }
  }

  