import { DynamoDbOperation } from '../../types/dynamoDbOperation'
import { dynamoDbDelete } from './dynamoDbDelete'
import { dynamoDbGet } from './dynamoDbGet'
import { dynamoDbPut } from './dynamoDbPut'

// delete tryParseJson
export const handler = async (dynamoOperationParams: DynamoDbOperation) => {
  // remove log before merge
  console.log('This is the event: ', dynamoOperationParams)
  if (!dynamoOperationParams)
    throw Error('Function called with undefined params')

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
