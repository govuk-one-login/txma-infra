import { Context } from 'aws-lambda'
import { DynamoDbOperation } from '../../types/dynamoDbOperation'
import {
  initialiseLogger,
  logger,
  appendZendeskIdToLogger
} from '../../utils/logger'
import { dynamoDbDelete } from './dynamoDbDelete'
import { dynamoDbGet } from './dynamoDbGet'
import { dynamoDbPut } from './dynamoDbPut'

export const handler = async (
  dynamoOperationParams: DynamoDbOperation,
  context: Context
) => {
  initialiseLogger(context)
  logger.info(
    'Function called with following params: ',
    JSON.stringify(dynamoOperationParams)
  )

  if (!dynamoOperationParams) {
    throw Error('Function called with undefined params')
  }
  if (dynamoOperationParams.params.zendeskId) {
    appendZendeskIdToLogger(dynamoOperationParams.params.zendeskId)
  }

  switch (dynamoOperationParams.operation) {
    case 'GET':
      return await dynamoDbGet(dynamoOperationParams.params)
    case 'PUT':
      return await dynamoDbPut(dynamoOperationParams.params)
    case 'DELETE':
      return await dynamoDbDelete(dynamoOperationParams.params)
    default:
      throw Error('Dynamo operation not recognised')
  }
}
