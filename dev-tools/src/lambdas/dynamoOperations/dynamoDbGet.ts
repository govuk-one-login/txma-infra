import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { logger } from '../../utils/logger'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbGet = async (operationParams: OperationParams) => {
  if (!operationParams.zendeskId)
    throw Error('No Zendesk ID found in dynamoDbGet parameters')
  const getDynamoEntryCommand = {
    TableName: operationParams.tableName,
    Key: {
      zendeskId: { S: `${operationParams.zendeskId}` }
    },
    ...(operationParams.attributeName && {
      ProjectionExpression: operationParams.attributeName
    })
  }

  logger.info(
    'Sending GetItemCommand to Dynamo with params: ',
    getDynamoEntryCommand
  )

  const item = await dynamoDbClient.send(
    new GetItemCommand(getDynamoEntryCommand)
  )
  return item?.Item
}
