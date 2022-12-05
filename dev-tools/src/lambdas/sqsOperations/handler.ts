import { SqsOperation } from '../../types/sqsOperation'
import { addMessageToQueue } from './addMessageToQueue'

export const handler = async (params: SqsOperation) => {
  console.log('Function called with following params: ', JSON.stringify(params))

  if (!params?.message || !params?.queueUrl)
    throw Error('Function called with invalid parameters')

  const addToQueueResponse = await addMessageToQueue(
    params.message,
    params.queueUrl
  )

  if (!addToQueueResponse.MessageId) throw Error('No message id returned')

  console.log(
    `Message "${params.message}" added to queue "${params.queueUrl}" with id "${addToQueueResponse.MessageId}"`
  )

  return addToQueueResponse.MessageId
}
