import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { sendQueryCompletedQueueMessage } from './sendQueryCompletedQueueMessage'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import {
  TEST_QUERY_COMPLETED_QUEUE_URL,
  TEST_ATHENA_QUERY_ID,
  TEST_MESSAGE_ID,
  TEST_ZENDESK_ID,
  TEST_EMAIL_ADDRESS
} from '../../utils/tests/testConstants'

const sqsMock = mockClient(SQSClient)

describe('sendQueryCompletedQueueMessage', () => {
  it('sends message to correct queue with correct details', async () => {
    sqsMock.on(SendMessageCommand).resolves({ MessageId: TEST_MESSAGE_ID })

    const messageId = await sendQueryCompletedQueueMessage(
      TEST_ATHENA_QUERY_ID,
      TEST_ZENDESK_ID,
      TEST_EMAIL_ADDRESS
    )
    expect(messageId).toEqual(TEST_MESSAGE_ID)
    expect(sqsMock).toHaveReceivedCommandWith(SendMessageCommand, {
      QueueUrl: TEST_QUERY_COMPLETED_QUEUE_URL,
      MessageBody: JSON.stringify({
        athenaQueryId: TEST_ATHENA_QUERY_ID,
        recipientEmail: TEST_EMAIL_ADDRESS,
        recipientName: 'Query Results Test Name',
        zendeskTicketId: TEST_ZENDESK_ID
      })
    })
  })
})
