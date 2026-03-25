import { describe, it, expect } from 'vitest'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-vitest/extend'
import {
  TEST_DYNAMO_TABLE_NAME,
  TEST_ITEM
} from '../../utils/tests/constants/testConstants.js'
import { dynamoDbPut } from './dynamoDbPut.js'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const dynamoMock = mockClient(DynamoDBDocumentClient)

describe('dynamoDbPut', () => {
  it('dynamo client is called with the correct params', async () => {
    const putItemCommand = {
      TableName: TEST_DYNAMO_TABLE_NAME,
      Item: TEST_ITEM
    }

    await dynamoDbPut({
      tableName: TEST_DYNAMO_TABLE_NAME,
      itemToPut: TEST_ITEM
    })

    expect(dynamoMock).toHaveReceivedCommandWith(PutCommand, putItemCommand)
  })
})
