import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { getEnv } from '../../utils/getEnv'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbGet = async (operationParams: OperationParams) => {
  if (!operationParams.zendeskId)
    throw Error('No Zendesk ID found in dynamoDbGet parameters')

  const getDynamoEntryCommand = {
    TableName: getEnv('AUDIT_REQUEST_DYNAMODB_TABLE'),
    Key: {
      zendeskId: { S: `${operationParams.zendeskId}` }
    },
    ...(operationParams.attributeName && {
      ProjectionExpression: operationParams.attributeName
    })
  }

  console.log(
    'Sending GetItemCommand to Dynamo with params: ',
    getDynamoEntryCommand
  )

  const item = await dynamoDbClient.send(
    new GetItemCommand(getDynamoEntryCommand)
  )
  return item?.Item
}
