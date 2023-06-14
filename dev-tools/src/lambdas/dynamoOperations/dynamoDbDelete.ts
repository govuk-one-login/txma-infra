import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { documentClient } from './dynamoDbClient'

export const dynamoDbDelete = async (operationParams: OperationParams) => {
  const deleteCommand = {
    TableName: operationParams.tableName,
    Key: operationParams.key
  }

  return documentClient.send(new DeleteCommand(deleteCommand))
}
