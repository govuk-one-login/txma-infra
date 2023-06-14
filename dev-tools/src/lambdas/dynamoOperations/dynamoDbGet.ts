import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbGet = async (operationParams: OperationParams) => {
  if (!operationParams.keyAttributeValue)
    throw Error('No keyAttributeValue found in dynamoDbGet parameters')
  if (!operationParams.keyAttributeName)
    throw Error('No keyAttributeName found in dynamoDbGet parameters')

  const getDynamoEntryCommand = {
    TableName: operationParams.tableName,
    Key: {
      [operationParams.keyAttributeName]: {
        S: `${operationParams.keyAttributeValue}`
      }
    },
    ...(operationParams.attributeName && {
      ProjectionExpression: operationParams.attributeName
    })
  }

  const item = await dynamoDbClient.send(
    new GetItemCommand(getDynamoEntryCommand)
  )
  return item?.Item
}
