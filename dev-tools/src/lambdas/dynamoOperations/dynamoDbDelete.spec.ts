import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import {
  QUERY_REQUEST_DYNAMODB_TABLE_NAME,
  ZENDESK_TICKET_ID
} from '../../utils/tests/constants/testConstants'
import { dynamoDbDelete } from './dynamoDbDelete'
import 'aws-sdk-client-mock-jest'

const dynamoMock = mockClient(DynamoDBClient)

describe('dynamoDbDelete', () => {
  const deleteDynamoEntryCommand = {
    TableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
    Key: {
      zendeskId: { S: ZENDESK_TICKET_ID }
    }
  }

  it('dynamo client is called with the correct params', async () => {
    jest.spyOn(global.console, 'log')

    await dynamoDbDelete({ zendeskId: ZENDESK_TICKET_ID })

    expect(console.log).toHaveBeenCalledWith(
      'Sending DeletetItemCommand to Dynamo with params: ',
      deleteDynamoEntryCommand
    )
    expect(dynamoMock).toHaveReceivedCommandWith(
      DeleteItemCommand,
      deleteDynamoEntryCommand
    )
  })

  it('throws an error when function is called without a zendeskId', async () => {
    expect(dynamoDbDelete({})).rejects.toThrow(
      'No Zendesk ID found in dynamoDbDelete parameters'
    )
  })
})
