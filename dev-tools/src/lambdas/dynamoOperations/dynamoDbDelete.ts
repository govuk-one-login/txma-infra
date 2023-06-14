import { DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbDelete = async (operationParams: OperationParams) => {
  if (!operationParams.keyAttributeValue)
    throw Error('No keyAttributeValue found in dynamoDbDelete parameters')
  if (!operationParams.keyAttributeName)
    throw Error('No keyAttributeName found in dynamoDbDelete parameters')

  const deleteDynamoEntryCommand = {
    TableName: operationParams.tableName,
    Key: {
      [operationParams.keyAttributeName]: {
        S: operationParams.keyAttributeValue
      }
    }
  }

  return dynamoDbClient.send(new DeleteItemCommand(deleteDynamoEntryCommand))
}
