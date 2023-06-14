import { mockClient } from 'aws-sdk-client-mock'
import {
  TEST_DESIRED_ATTRIBUTE_NAME,
  TEST_DYNAMO_TABLE_NAME,
  TEST_ITEM,
  TEST_KEY
} from '../../utils/tests/constants/testConstants'
import { dynamoDbGet } from './dynamoDbGet'
import 'aws-sdk-client-mock-jest'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoMock = mockClient(DynamoDBDocumentClient)

describe('dynamoDbGet', () => {
  const givenDatabaseReturnsData = () => {
    const mockDbGetContents = {
      Item: TEST_ITEM
    }
    dynamoMock.on(GetCommand).resolves(mockDbGetContents)
  }

  const generateGetDynamoEntryCommand = (desiredAttributeName?: string) => {
    return {
      TableName: TEST_DYNAMO_TABLE_NAME,
      Key: TEST_KEY,
      ...(desiredAttributeName && {
        ProjectionExpression: desiredAttributeName
      })
    }
  }

  it('dynamo client is called with the correct params (without attributeName)', async () => {
    const getDynamoEntryCommandWithoutAttName = generateGetDynamoEntryCommand()
    givenDatabaseReturnsData()

    const dynamoItem = await dynamoDbGet({
      tableName: TEST_DYNAMO_TABLE_NAME,
      key: TEST_KEY
    })

    expect(dynamoMock).toHaveReceivedCommandWith(
      GetCommand,
      getDynamoEntryCommandWithoutAttName
    )
    expect(dynamoItem).toEqual(TEST_ITEM)
  })

  it('dynamo client is called with the correct params (with attributeName)', async () => {
    const getDynamoEntryCommandWithAttName = generateGetDynamoEntryCommand(
      TEST_DESIRED_ATTRIBUTE_NAME
    )
    givenDatabaseReturnsData()

    const dynamoItem = await dynamoDbGet({
      tableName: TEST_DYNAMO_TABLE_NAME,
      key: TEST_KEY,
      desiredAttributeName: TEST_DESIRED_ATTRIBUTE_NAME
    })

    expect(dynamoMock).toHaveReceivedCommandWith(
      GetCommand,
      getDynamoEntryCommandWithAttName
    )
    expect(dynamoItem).toEqual(TEST_ITEM)
  })
})
