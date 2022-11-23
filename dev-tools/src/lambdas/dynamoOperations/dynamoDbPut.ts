import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { OperationParams } from '../../types/dynamoDbOperation'
import { getEnv } from '../../utils/getEnv'
import { dynamoDbClient } from './dynamoDbClient'

export const dynamoDbPut = async (operationParams: OperationParams) => {
  if (!operationParams.itemToPut)
    throw Error('No item found to put to db in dynamoDbPut parameters')

  const putDynamoEntryCommand = {
    TableName: getEnv('QUERY_REQUEST_DYNAMODB_TABLE_NAME'),
    ReturnValues: 'ALL_OLD',
    Item: operationParams.itemToPut
  }

  console.log(
    'Sending PutItemCommand to Dynamo with params: ',
    putDynamoEntryCommand
  )

  return dynamoDbClient.send(new PutItemCommand(putDynamoEntryCommand))
}
