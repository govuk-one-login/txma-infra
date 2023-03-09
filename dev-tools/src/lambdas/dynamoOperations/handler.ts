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
  if (!dynamoOperationParams) {
    throw Error('Function called with undefined params')
  }
  if (dynamoOperationParams.params.zendeskId) {
    appendZendeskIdToLogger(dynamoOperationParams.params.zendeskId)
  }

  let result
  switch (dynamoOperationParams.operation) {
    case 'GET':
      result = await dynamoDbGet(dynamoOperationParams.params)
      logger.info('Sent GetItemCommand to Dynamo')
      break
    case 'PUT':
      result = await dynamoDbPut(dynamoOperationParams.params)
      logger.info('Sent PutItemCommand to Dynamo')
      break
    case 'DELETE':
      result = await dynamoDbDelete(dynamoOperationParams.params)
      logger.info('Sent DeleteItemCommand to Dynamo')
      break
    default:
      throw Error('Dynamo operation not recognised')
  }
  return result
}
