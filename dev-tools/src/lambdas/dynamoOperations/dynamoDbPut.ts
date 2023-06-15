import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { documentClient } from './dynamoDbClient'

export const dynamoDbPut = async (operationParams: OperationParams) => {
  const putCommand = {
    TableName: operationParams.tableName,
    Item: operationParams.itemToPut
  }

  return documentClient.send(new PutCommand(putCommand))
}
