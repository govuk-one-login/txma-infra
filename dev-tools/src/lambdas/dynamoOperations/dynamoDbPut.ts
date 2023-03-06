import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbPut = async (operationParams: OperationParams) => {
  if (!operationParams.itemToPut)
    throw Error('No item found to put to db in dynamoDbPut parameters')

  const putDynamoEntryCommand = {
    TableName: operationParams.tableName,
    ReturnValues: 'ALL_OLD',
    Item: operationParams.itemToPut
  }

  return dynamoDbClient.send(new PutItemCommand(putDynamoEntryCommand))
}
