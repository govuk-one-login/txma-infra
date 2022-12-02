import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { mockClient } from 'aws-sdk-client-mock'
import { addMessageToQueue } from './addMessageToQueue'

describe('add message to queue', () => {
  const sqsMock = mockClient(SQSClient)

  test('sqs client is called with the correct parameters', async () => {
    const input = {
      MessageBody: 'test message',
      QueueUrl: 'https://sqs.eu-west-2.amazonaws.com/123456789012/MyQueue'
    }

    await addMessageToQueue(input.MessageBody, input.QueueUrl)

    expect(sqsMock).toHaveReceivedCommandWith(SendMessageCommand, input)
  })
})
