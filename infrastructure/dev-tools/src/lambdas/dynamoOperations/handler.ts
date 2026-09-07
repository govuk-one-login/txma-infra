import { Context } from 'aws-lambda'
import { DynamoDbOperation } from '../../types/dynamoDbOperation.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { dynamoDbDelete } from './dynamoDbDelete.js'
import { dynamoDbGet } from './dynamoDbGet.js'
import { dynamoDbPut } from './dynamoDbPut.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (
  dynamoDbOperation: DynamoDbOperation,
  context: Context
) => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', { operation: dynamoDbOperation?.operation })

  if (!dynamoDbOperation) {
    logger.error('Handler failed due to undefined params', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT004,
        message: 'Function called with undefined params'
      }
    })
    throw Error('Function called with undefined params')
  }

  let result
  const operation = dynamoDbOperation.operation

  logger.info('dynamo operation to run', {
    operation
  })

  switch (operation) {
    case 'GET':
      result = await dynamoDbGet(dynamoDbOperation.params)
      logger.info('GetItemCommand successfully sent to Dynamo', {
        tableName: dynamoDbOperation.params.tableName
      })
      break
    case 'PUT':
      result = await dynamoDbPut(dynamoDbOperation.params)
      logger.info('PutItemCommand successfully sent to Dynamo', {
        tableName: dynamoDbOperation.params.tableName
      })
      break
    case 'DELETE':
      result = await dynamoDbDelete(dynamoDbOperation.params)
      logger.info('DeleteItemCommand successfully sent to Dynamo', {
        tableName: dynamoDbOperation.params.tableName
      })
      break
    default:
      logger.error('Dynamo operation not recognised', {
        outcome: 'failure',
        duration: Date.now() - startTime,
        error: {
          code: ERROR_CODES.DT005,
          message: 'Dynamo operation not recognised',
          operation: dynamoDbOperation.operation
        }
      })
      throw Error('Dynamo operation not recognised')
  }

  logger.info('Handler completed', {
    outcome: 'success',
    duration: Date.now() - startTime,
    operation: dynamoDbOperation.operation
  })

  return result
}
