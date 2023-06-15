import { mockClient } from 'aws-sdk-client-mock'
import {
  TEST_DYNAMO_TABLE_NAME,
  TEST_DYNAMO_KEY
} from '../../utils/tests/constants/testConstants'
import { dynamoDbDelete } from './dynamoDbDelete'
import 'aws-sdk-client-mock-jest'
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const dynamoMock = mockClient(DynamoDBDocumentClient)

describe('dynamoDbDelete', () => {
  const deleteDynamoEntryCommand = {
    TableName: TEST_DYNAMO_TABLE_NAME,
    Key: TEST_DYNAMO_KEY
  }

  it('dynamo client is called with the correct params', async () => {
    await dynamoDbDelete({
      tableName: TEST_DYNAMO_TABLE_NAME,
      key: TEST_DYNAMO_KEY
    })

    expect(dynamoMock).toHaveReceivedCommandWith(
      DeleteCommand,
      deleteDynamoEntryCommand
    )
  })
})
