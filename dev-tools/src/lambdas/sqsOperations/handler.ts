import { SqsOperation } from '../../types/sqsOperation'
import { addMessageToQueue } from './addMessageToQueue'

export const handler = async (params: SqsOperation) => {
  if (!params) throw Error('Function called with undefined params')

  const addToQueueResponse = await addMessageToQueue(
    params.message,
    params.queueUrl
  )

  if (!addToQueueResponse.MessageId) throw Error('No message id returned')

  return addToQueueResponse.MessageId
}
