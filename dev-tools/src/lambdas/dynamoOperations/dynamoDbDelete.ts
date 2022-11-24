import { DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbDelete = async (operationParams: OperationParams) => {
  if (!operationParams.zendeskId)
    throw Error('No Zendesk ID found in dynamoDbDelete parameters')

  const deleteDynamoEntryCommand = {
    TableName: operationParams.tableName,
    Key: {
      zendeskId: { S: operationParams.zendeskId }
    }
  }

  console.log(
    'Sending DeleteItemCommand to Dynamo with params: ',
    deleteDynamoEntryCommand
  )

  return dynamoDbClient.send(new DeleteItemCommand(deleteDynamoEntryCommand))
}
