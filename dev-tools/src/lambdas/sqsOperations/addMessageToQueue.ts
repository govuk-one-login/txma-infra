import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { sqsClient } from './sqsClient'

export const addMessageToQueue = async (message: string, queueUrl: string) => {
  const input = {
    MessageBody: message,
    QueueUrl: queueUrl
  }

  return sqsClient.send(new SendMessageCommand(input))
}
