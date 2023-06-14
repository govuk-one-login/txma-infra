import { Context } from 'aws-lambda'
import { DynamoDbOperation } from '../../types/dynamoDbOperation'
import {
  initialiseLogger,
  logger,
  appendKeyAttributeDataToLogger
} from '../../utils/logger'
import { dynamoDbDelete } from './dynamoDbDelete'
import { dynamoDbGet } from './dynamoDbGet'
import { dynamoDbPut } from './dynamoDbPut'

export const handler = async (
  dynamoDbOperation: DynamoDbOperation,
  context: Context
) => {
  initialiseLogger(context)

  if (!dynamoDbOperation) {
    throw Error('Function called with undefined params')
  }

  if (dynamoDbOperation.params.key) {
    appendKeyAttributeDataToLogger(dynamoDbOperation.params.key)
  }

  let result
  switch (dynamoDbOperation.operation) {
    case 'GET':
      result = await dynamoDbGet(dynamoDbOperation.params)
      logger.info('GetItemCommand successfully sent to Dynamo')
      break
    case 'PUT':
      result = await dynamoDbPut(dynamoDbOperation.params)
      logger.info('PutItemCommand successfully sent to Dynamo')
      break
    case 'DELETE':
      result = await dynamoDbDelete(dynamoDbOperation.params)
      logger.info('DeleteItemCommand successfully sent to Dynamo')
      break
    default:
      throw Error('Dynamo operation not recognised')
  }
  return result
}
