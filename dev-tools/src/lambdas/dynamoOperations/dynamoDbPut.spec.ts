import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import {
  QUERY_REQUEST_DYNAMODB_TABLE_NAME,
  ZENDESK_TICKET_ID
} from '../../utils/tests/constants/testConstants'
import { dynamoDbPut } from './dynamoDbPut'
import 'aws-sdk-client-mock-jest'

const dynamoMock = mockClient(DynamoDBClient)

describe('dynamoDbPut', () => {
  it('dynamo client is called with the correct params', async () => {
    const item = { zendeskId: { S: ZENDESK_TICKET_ID } }
    const putItemCommand = {
      TableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      ReturnValues: 'ALL_OLD',
      Item: item
    }
    jest.spyOn(global.console, 'log')

    await dynamoDbPut({ itemToPut: item })

    expect(console.log).toHaveBeenCalledWith(
      'Sending PutItemCommand to Dynamo with params: ',
      putItemCommand
    )
    expect(dynamoMock).toHaveReceivedCommandWith(PutItemCommand, putItemCommand)
  })

  it('throws an error if function is called without an itemToPut', async () => {
    expect(dynamoDbPut({})).rejects.toThrow(
      'No item found to put to db in dynamoDbPut parameters'
    )
  })
})
