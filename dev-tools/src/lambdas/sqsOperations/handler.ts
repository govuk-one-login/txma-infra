import { SqsOperation } from '../../types/sqsOperation'
import { logger } from '../../utils/logger'
import { addMessageToQueue } from './addMessageToQueue'

export const handler = async (params: SqsOperation) => {
  logger.info('Function called with following params: ', JSON.stringify(params))

  if (!params?.message || !params?.queueUrl)
    throw Error('Function called with invalid parameters')

  const addToQueueResponse = await addMessageToQueue(
    params.message,
    params.queueUrl
  )

  if (!addToQueueResponse.MessageId) throw Error('No message id returned')

  logger.info(
    `Message "${params.message}" added to queue "${params.queueUrl}" with id "${addToQueueResponse.MessageId}"`
  )

  return addToQueueResponse.MessageId
}
