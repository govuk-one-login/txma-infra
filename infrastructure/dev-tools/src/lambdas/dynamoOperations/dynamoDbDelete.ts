import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation.js'
import { documentClient } from './dynamoDbClient.js'

export const dynamoDbDelete = async (operationParams: OperationParams) => {
  const deleteCommand = {
    TableName: operationParams.tableName,
    Key: operationParams.key
  }

  return documentClient.send(new DeleteCommand(deleteCommand))
}
