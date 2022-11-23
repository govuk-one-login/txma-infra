import { DynamoDbOperation } from '../../types/dynamoDbOperation'
import { tryParseJSON } from '../../utils/tryParseJson'
import { dynamoDbDelete } from './dynamoDbDelete'
import { dynamoDbGet } from './dynamoDbGet'
import { dynamoDbPut } from './dynamoDbPut'

export const handler = async (event: any) => {
  // remove log before merge
  console.log('This is the event: ', event)
  const dynamoOperationParams: DynamoDbOperation = tryParseJSON(event.body)
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
