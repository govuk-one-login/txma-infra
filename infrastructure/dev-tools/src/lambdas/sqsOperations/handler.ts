import { Context } from 'aws-lambda'
import { SqsOperation } from '../../types/sqsOperation.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { addMessageToQueue } from './addMessageToQueue.js'

export const handler = async (params: SqsOperation, context: Context) => {
  initialiseLogger(context)
  if (!params?.message || !params?.queueUrl)
    throw Error('Function called with invalid parameters')

  logger.info('Adding message to queue', { queueUrl: params.queueUrl })
  const addToQueueResponse = await addMessageToQueue(
    params.message,
    params.queueUrl
  )

  if (!addToQueueResponse.MessageId) throw Error('No message id returned')

  logger.info(
    `Message with id "${addToQueueResponse.MessageId}" added to queue "${params.queueUrl}"`
  )

  return addToQueueResponse.MessageId
}
