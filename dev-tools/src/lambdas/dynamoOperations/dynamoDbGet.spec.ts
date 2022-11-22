import {
  DynamoDBClient,
  GetItemCommand,
  GetItemOutput
} from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import {
  AUDIT_REQUEST_DYNAMODB,
  MOCK_ITEM,
  ZENDESK_TICKET_ID
} from '../../utils/tests/constants/testConstants'
import { dynamoDbGet } from './dynamoDbGet'
import 'aws-sdk-client-mock-jest'

const dynamoMock = mockClient(DynamoDBClient)

const givenDatabaseReturnsData = () => {
  const mockDbGetContents = {
    Item: MOCK_ITEM
  }
  dynamoMock.on(GetItemCommand).resolves(mockDbGetContents as GetItemOutput)
}

const getDynamoEntryCommandWithoutAttName = {
  TableName: AUDIT_REQUEST_DYNAMODB,
  Key: {
    zendeskId: { S: ZENDESK_TICKET_ID }
  }
}

const getDynamoEntryCommandWithAttName = {
  TableName: AUDIT_REQUEST_DYNAMODB,
  Key: {
    zendeskId: { S: ZENDESK_TICKET_ID }
  },
  ProjectionExpression: 'athenaQueryId'
}

describe('dynamoDbGet', () => {
  it('dynamo client is called with the correct params (without attributeName)', async () => {
    jest.spyOn(global.console, 'log')
    givenDatabaseReturnsData()

    const dynamoItem = await dynamoDbGet({ zendeskId: ZENDESK_TICKET_ID })

    expect(console.log).toHaveBeenCalledWith(
      'Sending GetItemCommand to Dynamo with params: ',
      getDynamoEntryCommandWithoutAttName
    )
    expect(dynamoMock).toHaveReceivedCommandWith(
      GetItemCommand,
      getDynamoEntryCommandWithoutAttName
    )
    expect(dynamoItem).toEqual(MOCK_ITEM)
  })

  it('dynamo client is called with the correct params (with attributeName)', async () => {
    jest.spyOn(global.console, 'log')
    givenDatabaseReturnsData()

    const dynamoItem = await dynamoDbGet({
      zendeskId: ZENDESK_TICKET_ID,
      attributeName: 'athenaQueryId'
    })

    expect(console.log).toHaveBeenCalledWith(
      'Sending GetItemCommand to Dynamo with params: ',
      getDynamoEntryCommandWithAttName
    )
    expect(dynamoMock).toHaveReceivedCommandWith(
      GetItemCommand,
      getDynamoEntryCommandWithAttName
    )
    expect(dynamoItem).toEqual(MOCK_ITEM)
  })

  it('throws an error if function is called without a zendeskId', async () => {
    expect(dynamoDbGet({})).rejects.toThrow(
      'No Zendesk ID found in dynamoDbGet parameters'
    )
  })
})
