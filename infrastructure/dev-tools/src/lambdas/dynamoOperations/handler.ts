import { Context } from 'aws-lambda'
import { DynamoDbOperation } from '../../types/dynamoDbOperation.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { dynamoDbDelete } from './dynamoDbDelete.js'
import { dynamoDbGet } from './dynamoDbGet.js'
import { dynamoDbPut } from './dynamoDbPut.js'

export const handler = async (
  dynamoDbOperation: DynamoDbOperation,
  context: Context
) => {
  initialiseLogger(context)

  if (!dynamoDbOperation) {
    throw Error('Function called with undefined params')
  }

  let result
  switch (dynamoDbOperation.operation) {
    case 'GET':
      result = await dynamoDbGet(dynamoDbOperation.params)
      logger.info('GetItemCommand successfully sent to Dynamo', {
        params: dynamoDbOperation.params
      })
      break
    case 'PUT':
      result = await dynamoDbPut(dynamoDbOperation.params)
      logger.info('PutItemCommand successfully sent to Dynamo', {
        params: dynamoDbOperation.params
      })
      break
    case 'DELETE':
      result = await dynamoDbDelete(dynamoDbOperation.params)
      logger.info('DeleteItemCommand successfully sent to Dynamo', {
        params: dynamoDbOperation.params
      })
      break
    default:
      throw Error('Dynamo operation not recognised')
  }
  return result
}
