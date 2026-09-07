import { Context } from 'aws-lambda'
import { SqsOperation } from '../../types/sqsOperation.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { addMessageToQueue } from './addMessageToQueue.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (params: SqsOperation, context: Context) => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', { queueUrl: params?.queueUrl })

  if (!params?.message || !params?.queueUrl) {
    logger.error('Handler failed due to invalid parameters', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT007,
        message: 'Function called with invalid parameters'
      }
    })
    throw Error('Function called with invalid parameters')
  }

  const addToQueueResponse = await addMessageToQueue(
    params.message,
    params.queueUrl
  )

  if (!addToQueueResponse.MessageId) {
    logger.error('No message ID returned from SQS', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: { code: ERROR_CODES.DT012, message: 'No message id returned' },
      queueUrl: params.queueUrl
    })
    throw Error('No message id returned')
  }

  logger.info('Message added to queue', {
    outcome: 'success',
    duration: Date.now() - startTime,
    messageId: addToQueueResponse.MessageId,
    queueUrl: params.queueUrl
  })

  return addToQueueResponse.MessageId
}
