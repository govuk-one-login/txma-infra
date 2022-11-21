import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
  GetItemOutput
} from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import {
  AUDIT_REQUEST_DYNAMODB,
  TEST_ATHENA_QUERY_ID,
  ZENDESK_TICKET_ID
} from '../../utils/tests/constants/testConstants'
import { dynamoDbGet } from './dynamoDbGet'
import 'aws-sdk-client-mock-jest'

const dynamoMock = mockClient(DynamoDBClient)

const mockItem: Record<string, AttributeValue> = {
  requestInfo: {
    M: {
      recipientEmail: { S: 'test@test.gov.uk' },
      recipientName: { S: 'test' },
      requesterEmail: { S: 'test@test.gov.uk' },
      requesterName: { S: 'test' },
      dateTo: { S: '2022-09-06' },
      identifierType: { S: 'eventId' },
      dateFrom: { S: '2022-09-06' },
      zendeskId: { S: '12' },
      eventIds: { L: [{ S: '234gh24' }, { S: '98h98bc' }] },
      piiTypes: { L: [{ S: 'passport_number' }] }
    }
  },
  zendeskId: { S: '12' },
  athenaQueryId: { S: TEST_ATHENA_QUERY_ID }
}
const givenDatabaseReturnsData = () => {
  const mockDbGetContents = {
    Item: mockItem
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
    expect(dynamoItem).toEqual(mockItem)
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
    expect(dynamoItem).toEqual(mockItem)
  })

  it('throws an error if function is called without a zendeskId', async () => {
    await expect(dynamoDbGet({ zendeskId: '' })).rejects.toThrow(
      'No Zendesk ID found in dynamoDbGet parameters'
    )
  })
})
