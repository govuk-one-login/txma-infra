import { Context } from 'aws-lambda'
import { initialiseLogger, logger } from '../../utils/logger'
import { s3Client } from '../../sharedServices/s3/s3Client'
import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
  ListObjectsCommand,
  ListObjectsCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectTaggingCommand,
  PutObjectTaggingCommandInput
} from '@aws-sdk/client-s3'
import { S3CommandType } from '../../types/s3CommandType'

export const handler = async (
  commandParameters: CommandParameters,
  context: Context
) => {
  initialiseLogger(context)
  const response = await runCommandFromParameters(commandParameters)
  logger.info('Completed s3 Operation', {
    commandParameters,
    response
  })
  return response
}

type CommandParameters = {
  commandType: S3CommandType
  commandInput: unknown
}

const runCommandFromParameters = (commandParameters: CommandParameters) => {
  switch (commandParameters.commandType) {
    case 'CopyObjectCommand':
      return s3Client.send(
        new CopyObjectCommand(
          commandParameters.commandInput as CopyObjectCommandInput
        )
      )
    case 'PutObjectCommand':
      return s3Client.send(
        new PutObjectCommand(
          commandParameters.commandInput as PutObjectCommandInput
        )
      )
    case 'PutObjectTaggingCommand':
      return s3Client.send(
        new PutObjectTaggingCommand(
          commandParameters.commandInput as PutObjectTaggingCommandInput
        )
      )
    case 'DeleteObjectCommand':
      return s3Client.send(
        new DeleteObjectCommand(
          commandParameters.commandInput as DeleteObjectCommandInput
        )
      )
    case 'ListObjectsV2Command':
      return s3Client.send(
        new ListObjectsV2Command(
          commandParameters.commandInput as ListObjectsV2CommandInput
        )
      )
    case 'DeleteObjectsCommand':
      return s3Client.send(
        new DeleteObjectsCommand(
          commandParameters.commandInput as DeleteObjectsCommandInput
        )
      )
    case 'ListObjectsCommand':
      return s3Client.send(
        new ListObjectsCommand(
          commandParameters.commandInput as ListObjectsCommandInput
        )
      )
    case 'HeadObjectCommand':
      return s3Client.send(
        new HeadObjectCommand(
          commandParameters.commandInput as HeadObjectCommandInput
        )
      )
    default:
      throw Error(
        `Unknown CommandType provided '${commandParameters.commandType}'`
      )
  }
}
