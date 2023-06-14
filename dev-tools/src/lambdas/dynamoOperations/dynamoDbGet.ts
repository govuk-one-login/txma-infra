import { GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { documentClient } from './dynamoDbClient'

export const dynamoDbGet = async (operationParams: OperationParams) => {
  const res = (await documentClient.send(
    new GetCommand({
      TableName: operationParams.tableName,
      Key: operationParams.key,
      ...(operationParams.desiredAttributeName && {
        ProjectionExpression: operationParams.desiredAttributeName
      })
    })
  )) as GetCommandOutput

  return res.Item
}
