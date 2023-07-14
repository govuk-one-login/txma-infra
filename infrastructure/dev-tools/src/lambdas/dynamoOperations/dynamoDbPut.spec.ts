import { mockClient } from 'aws-sdk-client-mock'
import {
  TEST_DYNAMO_TABLE_NAME,
  TEST_ITEM
} from '../../utils/tests/constants/testConstants'
import { dynamoDbPut } from './dynamoDbPut'
import 'aws-sdk-client-mock-jest'
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
