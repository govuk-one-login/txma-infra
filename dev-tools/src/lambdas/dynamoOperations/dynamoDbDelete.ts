import { DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { getEnv } from '../../utils/getEnv'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbDelete = async (operationParams: OperationParams) => {
  if (!operationParams.zendeskId)
    throw Error('No Zendesk ID found in dynamoDbDelete parameters')

  const deleteDynamoEntryCommand = {
    TableName: getEnv('QUERY_REQUEST_DYNAMODB_TABLE_NAME'),
    Key: {
      zendeskId: { S: operationParams.zendeskId }
    }
  }

  console.log(
    'Sending DeletetItemCommand to Dynamo with params: ',
    deleteDynamoEntryCommand
  )

  dynamoDbClient.send(new DeleteItemCommand(deleteDynamoEntryCommand))
}
