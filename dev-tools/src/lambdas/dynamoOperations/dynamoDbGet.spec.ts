import {
  DynamoDBClient,
  GetItemCommand,
  GetItemOutput
} from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import {
  QUERY_REQUEST_DYNAMODB_TABLE_NAME,
  MOCK_ITEM,
  ZENDESK_TICKET_ID
} from '../../utils/tests/constants/testConstants'
import { dynamoDbGet } from './dynamoDbGet'
import 'aws-sdk-client-mock-jest'
import { OperationParams } from '../../types/dynamoDbOperation'
import { logger } from '../../utils/logger'

const dynamoMock = mockClient(DynamoDBClient)

describe('dynamoDbGet', () => {
  const givenDatabaseReturnsData = () => {
    const mockDbGetContents = {
      Item: MOCK_ITEM
    }
    dynamoMock.on(GetItemCommand).resolves(mockDbGetContents as GetItemOutput)
  }

  const generateGetDynamoEntryCommand = (attributeName?: string) => {
    return {
      TableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      Key: {
        zendeskId: { S: ZENDESK_TICKET_ID }
      },
      ...(attributeName && { ProjectionExpression: attributeName })
    }
  }

  it('dynamo client is called with the correct params (without attributeName)', async () => {
    jest.spyOn(logger, 'info')
    const getDynamoEntryCommandWithoutAttName = generateGetDynamoEntryCommand()
    givenDatabaseReturnsData()

    const dynamoItem = await dynamoDbGet({
      tableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      zendeskId: ZENDESK_TICKET_ID
    })

    expect(logger.info).toHaveBeenCalledWith(
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
    jest.spyOn(logger, 'info')
    const getDynamoEntryCommandWithAttName =
      generateGetDynamoEntryCommand('athenaQueryId')
    givenDatabaseReturnsData()

    const dynamoItem = await dynamoDbGet({
      tableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      zendeskId: ZENDESK_TICKET_ID,
      attributeName: 'athenaQueryId'
    })

    expect(logger.info).toHaveBeenCalledWith(
      'Sending GetItemCommand to Dynamo with params: ',
      getDynamoEntryCommandWithAttName
    )
    expect(dynamoMock).toHaveReceivedCommandWith(
      GetItemCommand,
      getDynamoEntryCommandWithAttName
    )
    expect(dynamoItem).toEqual(MOCK_ITEM)
  })

  it('throws an error when function is called without a zendeskId', async () => {
    expect(dynamoDbGet({} as OperationParams)).rejects.toThrow(
      'No Zendesk ID found in dynamoDbGet parameters'
    )
  })
})
