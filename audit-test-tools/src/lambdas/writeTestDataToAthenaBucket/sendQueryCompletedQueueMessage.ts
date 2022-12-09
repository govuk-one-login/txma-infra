import {
  SQSClient,
  SendMessageRequest,
  SendMessageCommand
} from '@aws-sdk/client-sqs'

import { getEnv } from '../../utils/getEnv'

export const sendQueryCompletedQueueMessage = async (
  athenaQueryId: string,
  zendeskId: string
): Promise<string | undefined> => {
  const client = new SQSClient({ region: getEnv('AWS_REGION') })
  const message: SendMessageRequest = {
    QueueUrl: getEnv('QUERY_COMPLETED_QUEUE_URL'),
    MessageBody: JSON.stringify({
      athenaQueryId: athenaQueryId,
      recipientEmail: 'mytestrecipientemail@test.gov.uk',
      recipientName: 'Query Results Test Name',
      zendeskTicketId: zendeskId
    })
  }
  const result = await client.send(new SendMessageCommand(message))
  return result.MessageId
}
